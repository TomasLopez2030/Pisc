using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Migrations
{
    /// <inheritdoc />
    public partial class EliminarRelacionBombaServicioTecnico : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bombas_ServiciosTecnicos_ServicioTecnicoId",
                table: "Bombas");

            migrationBuilder.DropIndex(
                name: "IX_Bombas_ServicioTecnicoId",
                table: "Bombas");

            migrationBuilder.DropColumn(
                name: "ServicioTecnicoId",
                table: "Bombas");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ServicioTecnicoId",
                table: "Bombas",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bombas_ServicioTecnicoId",
                table: "Bombas",
                column: "ServicioTecnicoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bombas_ServiciosTecnicos_ServicioTecnicoId",
                table: "Bombas",
                column: "ServicioTecnicoId",
                principalTable: "ServiciosTecnicos",
                principalColumn: "Id");
        }
    }
}
