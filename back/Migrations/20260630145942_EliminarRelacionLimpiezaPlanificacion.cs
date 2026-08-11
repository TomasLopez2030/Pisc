using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Migrations
{
    /// <inheritdoc />
    public partial class EliminarRelacionLimpiezaPlanificacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlanificacionesClientes_Limpiezas_LimpiezaId",
                table: "PlanificacionesClientes");

            migrationBuilder.DropIndex(
                name: "IX_PlanificacionesClientes_LimpiezaId",
                table: "PlanificacionesClientes");

            migrationBuilder.DropColumn(
                name: "LimpiezaId",
                table: "PlanificacionesClientes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LimpiezaId",
                table: "PlanificacionesClientes",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlanificacionesClientes_LimpiezaId",
                table: "PlanificacionesClientes",
                column: "LimpiezaId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlanificacionesClientes_Limpiezas_LimpiezaId",
                table: "PlanificacionesClientes",
                column: "LimpiezaId",
                principalTable: "Limpiezas",
                principalColumn: "Id");
        }
    }
}
