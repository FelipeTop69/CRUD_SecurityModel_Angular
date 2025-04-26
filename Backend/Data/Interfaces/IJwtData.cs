using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace Data.Interfaces
{
    public interface IJwtData<TEntity>
    {
        Task<IEnumerable<TEntity>> GetAllJwtAsync(bool includeInactive = false);
    }
}
