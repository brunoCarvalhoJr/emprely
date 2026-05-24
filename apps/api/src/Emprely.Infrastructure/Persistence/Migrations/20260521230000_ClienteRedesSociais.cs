using Emprely.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(EmprelyDbContext))]
    [Migration("20260521230000_ClienteRedesSociais")]
    public partial class ClienteRedesSociais : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Instagram",
                table: "clientes",
                type: "character varying(160)",
                maxLength: 160,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Facebook",
                table: "clientes",
                type: "character varying(160)",
                maxLength: 160,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TikTok",
                table: "clientes",
                type: "character varying(160)",
                maxLength: 160,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Instagram",
                table: "clientes");

            migrationBuilder.DropColumn(
                name: "Facebook",
                table: "clientes");

            migrationBuilder.DropColumn(
                name: "TikTok",
                table: "clientes");
        }
    }
}
