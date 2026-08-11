using Microsoft.EntityFrameworkCore;
using Backend.Models;
using back.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cliente> Clientes => Set<Cliente>();
        public DbSet<Limpieza> Limpiezas { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<LimpiezaProducto> LimpiezaProductos { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LimpiezaProducto>()
                .HasKey(lp => new { lp.LimpiezaId, lp.ProductoId });

            modelBuilder.Entity<LimpiezaProducto>()
                .HasOne(lp => lp.Limpieza)
                .WithMany(l => l.LimpiezaProductos)
                .HasForeignKey(lp => lp.LimpiezaId);

            modelBuilder.Entity<LimpiezaProducto>()
                .HasOne(lp => lp.Producto)
                .WithMany(p => p.LimpiezaProductos)
                .HasForeignKey(lp => lp.ProductoId);

            modelBuilder.Entity<Limpieza>()
                .HasIndex(l => new { l.SerieId, l.Fecha })
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<ServicioTecnico> ServiciosTecnicos { get; set; }
        public DbSet<Bomba> Bombas { get; set; }
        public DbSet<PlanificacionCliente> PlanificacionesClientes { get; set; }
        public DbSet<FotoServicio> FotosServicios { get; set; }
        public DbSet<FotoBomba> FotosBombas { get; set; }


    }

}