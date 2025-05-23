﻿using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Data
{
    /// <summary>
    /// Repositorio encargador de la gestion de la entidad RolUser en la base de datos
    /// </summary>
    public class RolUserData : IData<RolUser>
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<RolUserData> _logger;

        ///<summary>
        ///Constructor que recibe el contexto de la base de datos
        ///</summary>
        ///<param name="context">Instancia de <see cref="ApplicationDbContext"/> Para la conexion con la base de datos.</param>
        public RolUserData(ApplicationDbContext context, ILogger<RolUserData> logger)
        {
            _context = context;
            _logger = logger;
        }


        /// <summary>
        /// Obtiene todos los RolUsers almacenados en la base de datos LINQ
        /// </summary>
        ///<returns>Lista de RolUsers</returns>
        public async Task<IEnumerable<RolUser>> GetAllAsync()
        {
            return await _context.Set<RolUser>()
                .Include(ru => ru.Rol)
                .Include(ru => ru.User)
                .Where(ru => ru.Active)
                .ToListAsync();
        }


        /// <summary>
        /// Obtiene un RolUser específico por su identificación LINQ
        /// </summary>
        /// <param name="id"></param>
        /// <returns>El RolUser Obtenido</returns>
        public async Task<RolUser?> GetByIdAsync(int id)
        {
            return await _context.Set<RolUser>()
                .Include(ru => ru.Rol)
                .Include(ru => ru.User)
                .FirstOrDefaultAsync(ru => ru.Id == id);
        }


        /// <summary>
        /// Crea un nuevo RolUser en la base de datos LINQ
        /// </summary>
        /// <param name="rolUser"></param>
        /// <returns>El RolUser Creado</returns>
        public async Task<RolUser> CreateAsync(RolUser rolUser)
        {
            await _context.Set<RolUser>().AddAsync(rolUser);
            await _context.SaveChangesAsync();
            return rolUser;
        }


        /// <summary>
        /// Actualiza un RolUser existente en la base de datos LINQ
        /// </summary>
        /// <param name="rolUser">Objeto con la informacion actualizada.</param>
        /// <returns>El RolUser Actualizado.</returns>
        public async Task<RolUser> UpdateAsync(RolUser rolUser)
        {
            _context.Set<RolUser>().Update(rolUser);
            await _context.SaveChangesAsync();
            return rolUser;
        }


        /// <summary>
        /// Elimina un RolUser de la base de datos LINQ
        /// </summary>
        /// <param name="id">Identificador unico del RolUser a eliminar </param>
        /// <returns>True si la eliminación fue exitosa, False en caso contrario.
        public async Task<bool> DeletePersistenceAsync(int id)
        {
            var rolUser = await _context.Set<RolUser>().FindAsync(id);
            if (rolUser == null)
                return false;

            _context.Set<RolUser>().Remove(rolUser);
            await _context.SaveChangesAsync();
            return true;
        }


        /// <summary>
        /// Elimina un RolUser de manera logica de la base de datos LINQ
        /// </summary>
        /// <param name="id">Identificador unico del RolUser a eliminar de manera logica</param>
        /// <returns>True si la eliminación fue exitosa, False en caso contrario.</returns>
        public async Task<bool> DeleteLogicAsync(int id)
        {
            var rolUser = await _context.Set<RolUser>().FindAsync(id);
            if (rolUser == null)
                return false;

            rolUser.Active = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}