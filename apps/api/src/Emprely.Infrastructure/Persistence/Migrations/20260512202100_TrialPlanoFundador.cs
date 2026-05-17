using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class TrialPlanoFundador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Plano",
                table: "contas",
                type: "character varying(24)",
                maxLength: 24,
                nullable: false,
                defaultValue: "Trial");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "PlanoFundadorAtivadoAt",
                table: "contas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "TrialEndsAt",
                table: "contas",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP + INTERVAL '7 days'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Plano",
                table: "contas");

            migrationBuilder.DropColumn(
                name: "PlanoFundadorAtivadoAt",
                table: "contas");

            migrationBuilder.DropColumn(
                name: "TrialEndsAt",
                table: "contas");
        }
    }
}
