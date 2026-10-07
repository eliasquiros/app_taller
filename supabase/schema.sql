-- Esquema de la App del Taller. Ejecutar completo en Supabase > SQL Editor.
-- Seguridad: RLS activo en todas las tablas; solo usuarios autenticados acceden.
-- Las funciones usan solo parámetros tipados (sin SQL dinámico), por lo que no hay inyección SQL posible.

-- ---------- Tablas ----------

create table equipos (
  id     bigint generated always as identity primary key,
  nombre text    not null unique check (char_length(trim(nombre)) between 1 and 60),
  puntos integer not null default 3 check (puntos >= 0)
);

create table integrantes (
  id        bigint generated always as identity primary key,
  nombre    text   not null check (char_length(trim(nombre)) between 1 and 60),
  apellido  text   not null check (char_length(trim(apellido)) between 1 and 60),
  equipo_id bigint references equipos (id) on delete set null -- una sola FK: un integrante, un equipo
);
create index on integrantes (equipo_id);

create table historial_puntos (
  id        bigint generated always as identity primary key,
  usuario   text        not null,
  equipo_id bigint      references equipos (id) on delete set null, -- el historial sobrevive al equipo
  cantidad  integer     not null check (cantidad <> 0),
  fecha     timestamptz not null default now()
);
create index on historial_puntos (fecha desc);

-- ---------- Tabla de puntuación (empates comparten puesto: 1, 1, 3) ----------

create view tabla_puntuacion with (security_invoker = true) as
  select id, nombre, puntos, rank() over (order by puntos desc) as puesto
  from equipos;

-- ---------- Row Level Security ----------

alter table equipos          enable row level security;
alter table integrantes      enable row level security;
alter table historial_puntos enable row level security;

create policy "autenticados" on equipos     for all to authenticated using (true) with check (true);
create policy "autenticados" on integrantes for all to authenticated using (true) with check (true);
-- El historial no se puede editar ni borrar: solo leer e insertar.
create policy "leer"     on historial_puntos for select to authenticated using (true);
create policy "insertar" on historial_puntos for insert to authenticated with check (true);

-- ---------- Funciones (transacciones atómicas) ----------

-- Suma o resta puntos; el total nunca baja de 0. Registra el cambio en el historial.
create function ajustar_puntos(p_equipo_id bigint, p_cantidad integer)
returns integer
language plpgsql
set search_path = public
as $$
declare
  v_nuevo integer;
begin
  if p_cantidad is null or p_cantidad = 0 then
    raise exception 'La cantidad debe ser distinta de 0';
  end if;

  update equipos set puntos = greatest(puntos + p_cantidad, 0)
  where id = p_equipo_id
  returning puntos into v_nuevo;

  if not found then
    raise exception 'Equipo no encontrado';
  end if;

  insert into historial_puntos (usuario, equipo_id, cantidad)
  values (split_part(auth.jwt() ->> 'email', '@', 1), p_equipo_id, p_cantidad);

  return v_nuevo;
end;
$$;

-- Crea (p_id null) o edita un equipo con 2 o 3 integrantes que no pertenezcan a otro equipo.
create function guardar_equipo(p_nombre text, p_integrantes bigint[], p_id bigint default null)
returns bigint
language plpgsql
set search_path = public
as $$
declare
  v_id    bigint := p_id;
  v_total integer := (select count(distinct i) from unnest(p_integrantes) as i);
begin
  if v_total not between 2 and 3 then
    raise exception 'El equipo debe tener 2 o 3 integrantes';
  end if;

  if v_id is null then
    insert into equipos (nombre) values (trim(p_nombre)) returning id into v_id;
  else
    update equipos set nombre = trim(p_nombre) where id = v_id;
    if not found then
      raise exception 'Equipo no encontrado';
    end if;
    update integrantes set equipo_id = null where equipo_id = v_id and id <> all (p_integrantes);
  end if;

  update integrantes set equipo_id = v_id
  where id = any (p_integrantes) and (equipo_id is null or equipo_id = v_id);

  if (select count(*) from integrantes where equipo_id = v_id) <> v_total then
    raise exception 'Algún integrante no existe o ya pertenece a otro equipo';
  end if;

  return v_id;
end;
$$;

-- Solo usuarios autenticados pueden ejecutar las funciones.
revoke execute on function ajustar_puntos, guardar_equipo from public, anon;
grant  execute on function ajustar_puntos, guardar_equipo to authenticated;
