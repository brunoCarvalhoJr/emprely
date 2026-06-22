using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PropostaAprovacaoPublica : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "PublicApprovalAcceptedAt",
                table: "propostas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicApprovalAcceptedIp",
                table: "propostas",
                type: "character varying(80)",
                maxLength: 80,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicApprovalAcceptedUserAgent",
                table: "propostas",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "PublicApprovalTokenCreatedAt",
                table: "propostas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicApprovalTokenHash",
                table: "propostas",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_propostas_PublicApprovalTokenHash",
                table: "propostas",
                column: "PublicApprovalTokenHash",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_propostas_PublicApprovalTokenHash",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "PublicApprovalAcceptedAt",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "PublicApprovalAcceptedIp",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "PublicApprovalAcceptedUserAgent",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "PublicApprovalTokenCreatedAt",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "PublicApprovalTokenHash",
                table: "propostas");
        }
    }
}
