using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class BillingCicloPlanoReembolsoParcial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "RefundedAmount",
                table: "pagamentos_conta",
                type: "numeric(10,2)",
                precision: 10,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ciclo",
                table: "pagamentos_conta",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Mensal");

            migrationBuilder.AddColumn<string>(
                name: "Ciclo",
                table: "assinaturas_conta",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Mensal");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ciclo",
                table: "pagamentos_conta");

            migrationBuilder.DropColumn(
                name: "Ciclo",
                table: "assinaturas_conta");

            migrationBuilder.AlterColumn<decimal>(
                name: "RefundedAmount",
                table: "pagamentos_conta",
                type: "numeric",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(10,2)",
                oldPrecision: 10,
                oldScale: 2,
                oldNullable: true);
        }
    }
}
