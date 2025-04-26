using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Interfaces
{
    public interface IJwtBusiness<TDto>
    {
        Task<IEnumerable<TDto>> GetAllJwtAsync(bool includeInactive = false);
    }
}
