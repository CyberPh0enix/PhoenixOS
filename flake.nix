{
  description = "Ph0enixOS devenv";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.pnpm
            supabase-cli
            git
          ];

          shellHook = ''
            echo "🔥 Ph0enixOS Environment Loaded."
            echo "📦 Node: $(node --version)"
            echo "⚡ Supabase: $(supabase --version)"

            alias run="pnpm run dev"
            alias build="pnpm run build"
          '';
        };
      }
    );
}
