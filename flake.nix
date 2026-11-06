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
        # Matches .nvmrc and netlify.toml, so the version that builds here is
        # the version Netlify builds with.
        default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_26
            pkgs.pnpm # NOTE: Make sure to update `netlify.toml` on every `nix flake update`.
            # What the `lint-ci` job runs.
            pkgs.actionlint
            pkgs.shellcheck
            # What the `glsl` job runs.
            pkgs.glslang
          ];
        };
      });
    };
}
