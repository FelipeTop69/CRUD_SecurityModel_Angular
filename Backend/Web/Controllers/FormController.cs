﻿using System.Security.Claims;
using Business;
using Business.Interfaces;
using Data;
using Entity.DTOs;
using Entity.DTOs.UserDTOs;
using Entity.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Utilities.Exceptions;

namespace Web.Controllers
{
    /// <summary>
    /// Controlador para la gestión de Forms en el sistema
    /// </summary>
    [Route("api/[controller]/")]
    [ApiController]
    [Produces("application/json")]

    public class FormController : ControllerBase
    {
        private readonly IBusiness<FormDTO, FormDTO> _formBusiness;
        private readonly FormBusiness _formBusinessJwt;
        private readonly ILogger<FormController> _logger;

        /// <summary>
        /// Constructor del controlador de Form
        /// </summary>
        /// <param name="FormBusiness">Capa de negocio de Form</param>
        /// <param name="logger">Logger para registro de Form</param>
        public FormController(IBusiness<FormDTO, FormDTO> formBusiness, FormBusiness formBusinessJwt, ILogger<FormController> logger)
        {
            _formBusiness = formBusiness;
            _formBusinessJwt = formBusinessJwt;
            _logger = logger;
        }


        /// <summary>
        /// Obtiene todos los Forms del sistema
        /// </summary>
        /// <returns>Lista de Formes</returns>
        /// <response code="200">Retorna la lista de Forms</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpGet("GetAll/")]
        [ProducesResponseType(typeof(IEnumerable<FormDTO>), 200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetAllForms()
        {
            try
            {
                var Forms = await _formBusiness.GetAllAsync();
                return Ok(Forms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los Forms");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene todos los Forms del sistema JWT
        /// </summary>
        /// <returns>Lista de Useres</returns>
        /// <response code="200">Retorna la lista de Users</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpGet("GetAllJWT/")]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<FormDTO>), 200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetAllUsersJWT()
        {
            try
            {
                var userRol = User.FindFirst(ClaimTypes.Role)?.Value;
                _logger.LogInformation("ROL DEL USUARIO JWT: {Rol}", userRol); // <- Agregalo aquí
                var includeInactive = userRol == "Administrador"; // Solo admins pueden ver inactivos
                var Forms = await _formBusinessJwt.GetAllJwtAsync(includeInactive);
                return Ok(Forms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los Forms");
                return StatusCode(500, new { message = ex.Message });
            }
        }


        /// <summary>
        /// Obtiene un Form específico por su ID
        /// </summary>
        /// <param name="id">ID del Form</param>
        /// <returns>Form solicitado</returns>
        /// <response code="200">Retorna el Form solicitado</response>
        /// <response code="400">ID proporcionado no válido</response>
        /// <response code="404">Form no encontrado</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpGet("GetById/{id}")]
        [ProducesResponseType(typeof(FormDTO), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetFormById(int id)
        {

            try
            {
                var Form = await _formBusiness.GetByIdAsync(id);
                return Ok(Form);
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "ID inválido para obtener de Form: {FormId}", id);
                return BadRequest(new { message = ex.Message });
            }
            catch (EntityNotFoundException ex)
            {

                _logger.LogInformation(ex, "Form no encontrado con ID: {FormId}", id);
                return NotFound(new { message = ex.Message });
            }
            catch (ExternalServiceException ex)
            {
                _logger.LogError(ex, "Error al obtener el Form con ID: {FormId}", id);
                throw;
            }
        }


        /// <summary>
        /// Crea un nuevo Form en el sistema
        /// </summary>
        /// <param name="FormDTO">Datos del Form a crear</param>
        /// <returns>form creado</returns>
        /// <response code="201">Retorna el Form creado</response>
        /// <response code="400">Datos del Form no válidos</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpPost("Create/")]
        [ProducesResponseType(typeof(FormDTO), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> CreateForm([FromBody] FormDTO formDTO)
        {
            try
            {
                var createdForm = await _formBusiness.CreateAsync(formDTO);
                return CreatedAtAction(nameof(GetFormById), new { id = createdForm.Id }, createdForm);
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validacion fallida al creal el Form");
                return BadRequest(new { message = ex.Message });
            }
            catch (ExternalServiceException ex)
            {
                _logger.LogError(ex, "Error al crear el Form");
                return StatusCode(500, new { message = ex.Message });
            }
        }


        /// <summary>
        /// Actualiza un Form existente en el sistema
        /// </summary>
        /// <param name="id">ID del Form a actualizar</param>
        /// <param name="formDto">Datos actualizados del Form</param>
        /// <returns>Form actualizado</returns>
        /// <response code="200">Retorna el Form actualizado</response>
        /// <response code="400">Datos inválidos o ID incorrecto</response>
        /// <response code="404">Form no encontrado</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpPut("Update/")]
        [ProducesResponseType(typeof(FormDTO), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UpdateForm([FromBody] FormDTO formDTO)
        {
            try
            {
                var updatedForm = await _formBusiness.UpdateAsync(formDTO);

                return Ok(updatedForm);
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "ID inválido para Actualizacion de Form: {FormId}",formDTO.Id);
                return BadRequest(new { message = ex.Message });
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex, "No se encontró el form con ID: {FormId}", formDTO.Id);
                return NotFound(new { message = ex.Message });
            }
            catch (ExternalServiceException ex)
            {
                _logger.LogError(ex, "Error al actualizar el form con ID: {FormId}", formDTO.Id);
                return StatusCode(500, new { message = ex.Message });
            }
        }


        /// <summary>
        /// Elimina un Form del sistema. Eleccion si la eliminación es lógica o permanente.
        /// </summary>
        /// <param name="id">ID del Form a eliminar</param>
        /// <returns>Mensaje de confirmación</returns>
        /// <response code="200">El Form fue eliminado exitosamente</response>
        /// <response code="400">Parametro Incorrecto</response>
        /// <response code="404">Form no encontrado</response>
        /// <response code="500">Error interno del servidor</response>
        [HttpDelete("Delete/{id}/")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> DeleteForm(int id, [FromQuery] DeleteType strategy = DeleteType.Logical)
        {
            try
            {
                await _formBusiness.DeleteAsync(id, strategy);
                return Ok(new { message = $"Eliminación con estrategy {strategy} exitosa." });
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "ID inválido para eliminación de Form: {FormId}", id);
                return BadRequest(new { message = ex.Message });
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex, "No se encontró el Form con ID: {FormId}", id);
                return NotFound(new { message = ex.Message });
            }
            catch (ExternalServiceException ex)
            {
                _logger.LogError(ex, "Error al eliminar el Form con ID: {FormId}", id);
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}