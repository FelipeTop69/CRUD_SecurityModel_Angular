using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Data.Interfaces;
using Entity.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Data
{
    public abstract class JwtBaseData<TEntity> : IJwtData<TEntity> where TEntity : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly ILogger _logger;

        public JwtBaseData(ApplicationDbContext context, ILogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public virtual async Task<IEnumerable<TEntity>> GetAllJwtAsync(bool includeInactive = false)
        {
            var query = _context.Set<TEntity>().AsQueryable();

            if (!includeInactive)
            {
                var parameter = Expression.Parameter(typeof(TEntity), "x");
                var property = Expression.Property(parameter, "Active");
                var condition = Expression.Equal(property, Expression.Constant(true));
                var lambda = Expression.Lambda<Func<TEntity, bool>>(condition, parameter);

                query = query.Where(lambda);
            }

            return await query.ToListAsync();
        }
    }
}
