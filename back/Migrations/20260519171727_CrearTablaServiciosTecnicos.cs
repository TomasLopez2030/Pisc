using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Migrations
{
    /// <inheritdoc />
    public partial class CrearTablaServiciosTecnicos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Barrio",
                table: "ServiciosTecnicos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Diagnostico",
                table: "ServiciosTecnicos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "ServiciosTecnicos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EstadoPago",
                table: "ServiciosTecnicos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Lote",
                table: "ServiciosTecnicos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Manzana",
                table: "ServiciosTecnicos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Observaciones",
                table: "ServiciosTecnicos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Precio",
                table: "ServiciosTecnicos",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "TrabajoRealizado",
                table: "ServiciosTecnicos",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Barrio",
                table: "ServiciosTecnicos");

            migrationBuilder.DropColumn(
                name: "Diagnostico",
                table: "ServiciosTecnicos");

            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "ServiciosTecnicos");

            migrationBuilder.DropColumn(
                name: "EstadoPago",
                table: "ServiciosTecnicos");

            migrationBuilder.DropColumn(
                name: "Lote",
                table: "ServiciosTecnicos");

            migrationBuilder.DropColumn(
                name: "Manzana",
                table: "ServiciosTecnicos");

            migrationBuilder.DropColumn(
                name: "Observaciones",
                table: "ServiciosTecnicos");

            migrationBuilder.DropColumn(
                name: "Precio",
                table: "ServiciosTecnicos");

            migrationBuilder.DropColumn(
                name: "TrabajoRealizado",
                table: "ServiciosTecnicos");
        }
    }
}
