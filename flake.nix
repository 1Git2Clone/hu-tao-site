{
  description = "Development shell for the 1Git2Clone site";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      # No x86_64-darwin: nixos-unstable deprecated it and it now throws on
      # eval, which would fail `nix flake check --all-systems` for everyone else.
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];

      forAllSystems = fn: nixpkgs.lib.genAttrs systems (system: fn nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {
        # .nvmrc and netlify.toml still say node 20, which went EOL on
        # 2026-04-30 and now throws on eval in nixpkgs. 22 is the oldest LTS
        # that still builds.
        default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_22
            pkgs.pnpm
          ];
        };
      });
    };
}
