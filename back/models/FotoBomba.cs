using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Backend.Models;

namespace back.Models
{
    public class FotoBomba
    {
        [Key]
        public int Id { get; set; }

        public int BombaId { get; set; }

        [JsonIgnore]
        public Bomba Bomba { get; set; } = null!;

        public string NombreArchivo { get; set; } = "";

        public DateTime FechaSubida { get; set; } = DateTime.UtcNow;
    }
}