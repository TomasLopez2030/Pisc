using Backend.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace back.Models
{
    public class PlanificacionCliente
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        [JsonIgnore]
        public Cliente Cliente { get; set; } = null!;
        public string DiaSemana { get; set; } = "";
        public string Frecuencia { get; set; } = "";
        [Column(TypeName = "timestamp without time zone")]
        public DateTime FechaInicio { get; set; }
        public bool Activa { get; set; } = true;
        public int SerieId { get; set; }
        public bool Archivada { get; set; } = false;
    }
}