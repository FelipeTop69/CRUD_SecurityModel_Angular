using Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/[controller]/")]
    public abstract class JwtBaseController<TDto> : ControllerBase
    {
        protected readonly IJwtBusiness<TDto> _business;
        protected readonly ILogger _logger;

        public JwtBaseController(IJwtBusiness<TDto> business, ILogger logger)
        {
            _business = business;
            _logger = logger;
        }

        [HttpGet("GetAllJWT/")]
        [Authorize]
        // No se puede usar typeof(IEnumerable<TDto>) aquí
        public virtual async Task<IActionResult> GetAllJwt()
        {
            try
            {
                var userRol = User.FindFirst(ClaimTypes.Role)?.Value;
                _logger.LogInformation("ROL DEL USUARIO JWT: {Rol}", userRol);

                var includeInactive = userRol == "Administrador";
                var result = await _business.GetAllJwtAsync(includeInactive);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los registros con JWT");
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
