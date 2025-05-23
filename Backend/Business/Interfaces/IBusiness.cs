﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity.Enums;

namespace Business.Interfaces
{
    public interface IBusiness<TDto, TCreateDto>
    {
        Task<IEnumerable<TDto>> GetAllAsync();
        Task<TDto> GetByIdAsync(int id);
        Task<TCreateDto> CreateAsync(TCreateDto createDto);
        Task<TCreateDto> UpdateAsync(TCreateDto createDto);
        Task<bool> DeleteAsync(int id, DeleteType deleteType); 
    }
}
