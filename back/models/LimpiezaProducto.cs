namespace back.Models
{
    public class LimpiezaProducto
    {
        public int LimpiezaId { get; set; }
        public Limpieza Limpieza { get; set; }
        public int ProductoId { get; set; }
        public Producto Producto { get; set; }
        public int Cantidad { get; set; } = 1;
    }
}