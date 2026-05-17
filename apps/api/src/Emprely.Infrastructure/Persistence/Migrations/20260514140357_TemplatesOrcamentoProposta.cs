using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class TemplatesOrcamentoProposta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BeneficiosTexto",
                table: "propostas",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CondicoesPagamento",
                table: "propostas",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CronogramaTexto",
                table: "propostas",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DescontoValor",
                table: "propostas",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ItensInclusosTexto",
                table: "propostas",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ItensNaoInclusosTexto",
                table: "propostas",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TemplateVisual",
                table: "propostas",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "ComercialMinimalista");

            migrationBuilder.AddColumn<string>(
                name: "TemplateVisualPadrao",
                table: "perfis_conta",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "ComercialMinimalista");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BeneficiosTexto",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "CondicoesPagamento",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "CronogramaTexto",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "DescontoValor",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "ItensInclusosTexto",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "ItensNaoInclusosTexto",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "TemplateVisual",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "TemplateVisualPadrao",
                table: "perfis_conta");
        }
    }
}
