﻿using AutoMapper;
using Business.Interfaces;
using Data;
using Data.Interfaces;
using Entity.DTOs;
using Entity.Enums;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Strategy.Interfaces;
using Utilities.Exceptions;

namespace Business
{
    ///<summary>
    ///Clase de negocio encargada de la logica relacionada con Rol en el sistema;
    ///</summary>
    public class RolBusiness : IBusiness<RolDTO, RolDTO>
    {
        private readonly IData<Rol> _rolData;
        private readonly IDeleteStrategyResolver<Rol> _strategyResolver;
        private readonly ILogger<RolBusiness> _logger;
        private readonly IMapper _mapper;


        /// <summary>
        /// Inicializa una nueva instancia de la clase <see cref="RolBusiness"/>.
        /// </summary>
        /// <param name="rolData">Capa de acceso a datos para Rol.</param>
        /// <param name="logger">Logger para registro de Rol</param>
        public RolBusiness(IData<Rol> rolData, IDeleteStrategyResolver<Rol> strategyResolver, ILogger<RolBusiness> logger, IMapper mapper)
        {
            _rolData = rolData;
            _strategyResolver = strategyResolver;
            _logger = logger;
            _mapper = mapper;
        }


        /// <summary>
        /// Obtiene todos los Rols y los mapea a objetos <see cref="RolDTO"/>.
        /// </summary>
        /// <returns>Una colección de objetos <see cref="RolDTO"/> que representan todos los Rols existentes.</returns>
        /// <exception cref="ExternalServiceException">
        /// Se lanza cuando ocurre un error al intentar recuperar los datos desde la base de datos.
        /// </exception>
        public async Task<IEnumerable<RolDTO>> GetAllAsync()
        {
            try
            {
                var roles = await _rolData.GetAllAsync();
                return _mapper.Map<IEnumerable<RolDTO>>(roles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener todos los Rols");
                throw new ExternalServiceException("Base de datos", "Error al recuperar la lista de Rols", ex);
            }
        }


        /// <summary>
        /// Obtiene un Rol especifico por su identificador y lo mapea a un objeto <see cref="RolDTO"/>.
        /// </summary>
        /// <param name="id">Identificador único del rol a buscar. Debe ser mayor que cero.</param>
        /// <returns>Un objeto <see cref="RolDTO"/> que representa el rol solicitado.</returns>
        /// <exception cref="Utilities.Exceptions.ValidationException">
        /// Se lanza cuando el parámetro <paramref name="id"/> es menor o igual a cero.
        /// </exception>
        /// <exception cref="EntityNotFoundException">
        /// Se lanza cuando no se encuentra ningún rol con el ID especificado.
        /// </exception>
        /// <exception cref="ExternalServiceException">
        /// Se lanza cuando ocurre un error inesperado al mapear o recuperar el rol desde la base de datos.
        /// </exception>
        public async Task<RolDTO> GetByIdAsync(int id)
        {
            if (id <= 0)
            {
                _logger.LogWarning("Se intentó obtener un Rol con ID inválido: {RolId}", id);
                throw new Utilities.Exceptions.ValidationException("id", "El ID del Rol debe ser mayor que cero");
            }

            var rol = await _rolData.GetByIdAsync(id);

            if (rol == null)
            {
                _logger.LogInformation("No se encontró ningún Rol con ID: {RolId}", id);
                throw new EntityNotFoundException("Rol", id);
            }

            try
            {
                return _mapper.Map<RolDTO>(rol);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el Rol con ID: {RolId}", id);
                throw new ExternalServiceException("Base de datos", $"Error al recuperar el Rol con ID {id}", ex);
            }
        }


        /// <summary>
        /// Crea un nuevo Rol en la base de datos a partir de un objeto <see cref="RolDTO"/>.
        /// </summary>
        /// <param name="RolDto">Objeto <see cref="RolDTO"/> que contiene la inrolación del rol a crear.</param>
        /// <returns>El objeto <see cref="RolDTO"/> que representa el Rol recién creado, incluyendo su identificador asignado.</returns>
        /// <exception cref="Utilities.Exceptions.ValidationException">
        /// Se lanza si el DTO del rol no cumple con las reglas de validación definidas.
        /// </exception>
        /// <exception cref="ExternalServiceException">
        /// Se lanza cuando ocurre un error al intentar crear el rol en la base de datos.
        /// </exception>
        public async Task<RolDTO> CreateAsync(RolDTO RolDto)
        {
            ValidateRol(RolDto);

            try
            {
                RolDto.Status = true;

                var rol = _mapper.Map<Rol>(RolDto);
                var rolCreado = await _rolData.CreateAsync(rol);

                return _mapper.Map<RolDTO>(rolCreado);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear nuevo Rol: {RolNombre}", RolDto?.Name ?? "null");
                throw new ExternalServiceException("Base de datos", "Error al crear el Rol", ex);
            }
        }


        /// <summary>
        /// Actualiza un Rol existente en la base de datos con los datos proporcionados en el <see cref="RolDTO"/>.
        /// </summary>
        /// <param name="rolDTO">Objeto <see cref="RolDTO"/> con la inrolación actualizada del Rol. Debe contener un ID válido.</param>
        /// <returns>Un valor booleano que indica si la operación de actualización fue exitosa.</returns>
        /// <exception cref="Utilities.Exceptions.ValidationException">
        /// Se lanza si el DTO del rol no cumple con las reglas de validación definidas.
        /// </exception>
        /// <exception cref="EntityNotFoundException">
        /// Se lanza si no se encuentra ningún rol con el ID especificado.
        /// </exception>
        /// <exception cref="ExternalServiceException">
        /// Se lanza cuando ocurre un error inesperado al intentar actualizar el rol en la base de datos.
        /// </exception>
        public async Task<RolDTO> UpdateAsync(RolDTO rolDTO)
        {
            if (rolDTO.Id <= 0)
            {
                _logger.LogWarning("Se intentó Actualizar un Rol con ID inválido: {RolId}", rolDTO.Id);
                throw new Utilities.Exceptions.ValidationException("id", "El ID del Rol debe ser mayor que cero");
            }

            ValidateRol(rolDTO);

            var existingRol = await _rolData.GetByIdAsync(rolDTO.Id);
            if (existingRol == null)
            {
                throw new EntityNotFoundException("Rol", rolDTO.Id);
            }

            try
            {
                _mapper.Map(rolDTO, existingRol);

                var updateRol = await _rolData.UpdateAsync(existingRol);

                return _mapper.Map<RolDTO>(updateRol);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el Rol con ID: {UserId}", rolDTO.Id);
                throw new ExternalServiceException("Base de datos", "Error al actualizar el Rol.", ex);
            }
        }


        /// <summary>
        /// Elimina un Rol. Eleccion si la eliminación es lógica o permanente.
        /// </summary>
        /// <param name="id">ID del Rol</param>
        /// <param name="strategy">Tipo de eliminación (Logical o Permanent)</param>
        /// <exception cref="EntityNotFoundException">
        /// Se lanza si no se encuentra ningún rol con el ID especificado.
        /// </exception>
        /// <exception cref="ExternalServiceException">
        /// Se lanza cuando ocurre un error inesperado al intentar actualizar el rol en la base de datos.
        /// </exception>
        public async Task<bool> DeleteAsync(int id, DeleteType strategyType)
        {
            if (id <= 0)
            {
                _logger.LogWarning("Se intentó Eliminar un Rol con ID inválido: {RolId}", id);
                throw new Utilities.Exceptions.ValidationException("id", "El ID del Rol debe ser mayor que cero");
            }

            var existingRol = await _rolData.GetByIdAsync(id);
            if (existingRol == null)
            {
                throw new EntityNotFoundException("Rol", id);
            }

            try
            {
                var strategy = _strategyResolver.Resolve(strategyType);
                return await strategy.DeleteAsync(id, _rolData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar el Rol con ID: {RolId}", id);
                throw new ExternalServiceException("Base de datos", "Error al eliminar el Rol.", ex);
            }
        }


        /// <summary>
        /// Metodo para Validar el Rol
        /// </summary>
        /// <param name="RolDto"></param>
        /// <exception cref="Utilities.Exceptions.ValidationException"></exception>
        private void ValidateRol(RolDTO RolDto)
        {
            if (RolDto == null)
            {
                throw new Utilities.Exceptions.ValidationException("El objeto Rol no puede ser nulo");
            }

            if (string.IsNullOrWhiteSpace(RolDto.Name))
            {
                _logger.LogWarning("Se intentó crear/actualizar un Rol con Name vacío");
                throw new Utilities.Exceptions.ValidationException("Name", "El Name del Rol es obligatorio");
            }
        }
    }
}
