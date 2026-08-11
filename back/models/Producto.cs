namespace back.Models
{
    public class Producto
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public decimal Precio { get; set; }

        public ICollection<LimpiezaProducto> LimpiezaProductos { get; set; } = new List<LimpiezaProducto>();
    }
}