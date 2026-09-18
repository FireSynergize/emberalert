{
  description = "FireSynergize — Wildfire damage assessment & safety web app";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            pnpm
          ];
          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            echo "FireSynergize dev environment ready — Node $(node --version), pnpm $(pnpm --version)"
          '';
        };
      });
}
