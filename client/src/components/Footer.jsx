import { Facebook, Twitter, Linkedin, Instagram, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2025 NewRa Grids. All rights reserved.
          </p>

          <div className="flex space-x-4">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61581721202186"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-transform transform hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>

            {/* Twitter / X */}
            <a
              href="https://x.com/NewRaGrids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-transform transform hover:scale-110"
              aria-label="Twitter/X"
            >
              <Twitter className="h-5 w-5" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/newra-grids-2b98ab388/?trk=opento_sprofile_topcard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-transform transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/newra.grids/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-transform transform hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>

            {/* Reddit */}
            <a
              href="https://www.reddit.com/user/NewRaGrids/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-transform transform hover:scale-110"
              aria-label="Reddit"
            >
              <Globe className="h-5 w-5" />
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}
