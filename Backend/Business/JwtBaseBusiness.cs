using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Microsoft.Extensions.Logging;
using Utilities.Exceptions;

namespace Business
{
    public abstract class JwtBaseBusiness<TEntity, TDto> : IJwtBusiness<TDto>
        where TEntity : class
        where TDto : class
    {
        protected readonly IJwtData<TEntity> _data;
        protected readonly IMapper _mapper;
        protected readonly ILogger _logger;

        public JwtBaseBusiness(IJwtData<TEntity> data, IMapper mapper, ILogger logger)
        {
            _data = data;
            _mapper = mapper;
            _logger = logger;
        }

        public virtual async Task<IEnumerable<TDto>> GetAllJwtAsync(bool includeInactive = false)
        {
            try
            {
                var entities = await _data.GetAllJwtAsync(includeInactive);
                return _mapper.Map<IEnumerable<TDto>>(entities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener todos los {typeof(TEntity).Name} con JWT");
                throw new ExternalServiceException("Base de datos",
                    $"Error al recuperar la lista de {typeof(TEntity).Name}.", ex);
            }
        }
    }
}
