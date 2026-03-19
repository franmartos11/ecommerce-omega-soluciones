const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setAdmin() {
  const targetEmail = 'ventas@omegasoluciones.com.ar';
  console.log(`Buscando usuario con email: ${targetEmail}`);

  // Primero intentamos actualizar por email si la tabla users tiene columna email
  const { data, error } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('email', targetEmail)
    .select();

  if (error) {
    console.log("Error al actualizar por email:", error.message);
    
    // Si falla porque no hay columna email, tenemos que buscarlo en auth.users
    console.log("Intentando buscar en auth.users...");
    
    // Using admin api
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log("Error consultando auth.users:", authError.message);
      return;
    }
    
    const user = authData.users.find(u => u.email === targetEmail);
    if (!user) {
      console.log(`Usuario con email ${targetEmail} no encontrado en auth.users.`);
      return;
    }
    
    console.log(`Usuario encontrado con ID: ${user.id}. Actualizando rol...`);
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', user.id)
      .select();
      
    if (updateError) {
      console.log("Error al actualizar por ID:", updateError.message);
    } else {
      console.log("Rol de admin asignado con éxito:", updateData);
    }
  } else {
    if (data && data.length > 0) {
      console.log("Rol de admin asignado con éxito por email:", data);
    } else {
      console.log("No se encontró ningún usuario con ese email en la tabla users.");
      
      // If it succeeded but no rows returned, perhaps the 'users' table has no row yet for this user?
      // Or maybe the RLS prevents service_role from seeing it? (Service role bypasses RLS).
      // Let's also check auth.users directly just in case.
      console.log("Verificando en auth.users...");
      const { data: authData } = await supabase.auth.admin.listUsers();
      if (authData && authData.users) {
         const user = authData.users.find(u => u.email === targetEmail);
         if (user) {
             console.log(`El usuario existe en auth.users con ID: ${user.id}, pero no estaba en la tabla users pública o no tenía email allí.`);
             // Let's create or update using ID
             const { data: upsertData, error: upsertError } = await supabase
               .from('users')
               .upsert({ id: user.id, email: user.email, role: 'admin' })
               .select();
             if (upsertError) {
                 console.log("Error haciendo upsert:", upsertError.message);
             } else {
                 console.log("Usuario insertado/actualizado como admin:", upsertData);
             }
         } else {
             console.log("El usuario tampoco existe en auth.users.");
         }
      }
    }
  }
}

setAdmin();
