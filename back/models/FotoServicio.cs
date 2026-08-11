using System.ComponentModel.DataAnnotations;
using Backend.Models;
using System.Text.Json.Serialization;

namespace back.Models
{
    public class FotoServicio
    {
        [Key]
        public int Id { get; set; }

        public int ServicioTecnicoId { get; set; }

        [JsonIgnore]
        public ServicioTecnico ServicioTecnico { get; set; } = null!;

        public string NombreArchivo { get; set; } = "";

        public DateTime FechaSubida { get; set; } = DateTime.UtcNow;

        public string Ruta { get; set; } = "";
    }
}