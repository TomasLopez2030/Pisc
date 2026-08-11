using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Migrations
{
    /// <inheritdoc />
    public partial class AgregarPlanificacionCliente : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlanificacionCliente_Clientes_ClienteId",
                table: "PlanificacionCliente");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanificacionCliente_Limpiezas_LimpiezaId",
                table: "PlanificacionCliente");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlanificacionCliente",
                table: "PlanificacionCliente");

            migrationBuilder.RenameTable(
                name: "PlanificacionCliente",
                newName: "PlanificacionesClientes");

            migrationBuilder.RenameIndex(
                name: "IX_PlanificacionCliente_LimpiezaId",
                table: "PlanificacionesClientes",
                newName: "IX_PlanificacionesClientes_LimpiezaId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanificacionCliente_ClienteId",
                table: "PlanificacionesClientes",
                newName: "IX_PlanificacionesClientes_ClienteId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlanificacionesClientes",
                table: "PlanificacionesClientes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlanificacionesClientes_Clientes_ClienteId",
                table: "PlanificacionesClientes",
                column: "ClienteId",
                principalTable: "Clientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanificacionesClientes_Limpiezas_LimpiezaId",
                table: "PlanificacionesClientes",
                column: "LimpiezaId",
                principalTable: "Limpiezas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlanificacionesClientes_Clientes_ClienteId",
                table: "PlanificacionesClientes");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanificacionesClientes_Limpiezas_LimpiezaId",
                table: "PlanificacionesClientes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlanificacionesClientes",
                table: "PlanificacionesClientes");

            migrationBuilder.RenameTable(
                name: "PlanificacionesClientes",
                newName: "PlanificacionCliente");

            migrationBuilder.RenameIndex(
                name: "IX_PlanificacionesClientes_LimpiezaId",
                table: "PlanificacionCliente",
                newName: "IX_PlanificacionCliente_LimpiezaId");

            migrationBuilder.RenameIndex(
                name: "IX_PlanificacionesClientes_ClienteId",
                table: "PlanificacionCliente",
                newName: "IX_PlanificacionCliente_ClienteId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlanificacionCliente",
                table: "PlanificacionCliente",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlanificacionCliente_Clientes_ClienteId",
                table: "PlanificacionCliente",
                column: "ClienteId",
                principalTable: "Clientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanificacionCliente_Limpiezas_LimpiezaId",
                table: "PlanificacionCliente",
                column: "LimpiezaId",
                principalTable: "Limpiezas",
                principalColumn: "Id");
        }
    }
}
