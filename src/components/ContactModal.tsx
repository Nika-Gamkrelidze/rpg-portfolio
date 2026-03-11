import React from "react";
import { characterInfo } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Phone, Linkedin, Github, UserPlus } from "lucide-react";

const ContactModal: React.FC = () => {
  const { contact } = characterInfo;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 border-2 border-primary rounded-sm bg-secondary/60 hover:bg-primary/20 hover:border-accent transition-all duration-300 text-sm font-heading uppercase tracking-wider text-foreground hover:text-accent group cursor-pointer">
          <UserPlus className="w-4 h-4 text-primary group-hover:text-accent transition-colors" />
          <span>Add to Friend List</span>
        </button>
      </DialogTrigger>
      <DialogContent className="border-2 border-primary bg-card/95 backdrop-blur-sm max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-accent text-center">
            📜 Contact Scroll
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground text-center tracking-widest uppercase">
            {characterInfo.name} wishes to share their contact runes
          </p>

          <div className="space-y-3 border-t border-border pt-4">
            <a href={`mailto:${contact.email}`} className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-primary hover:bg-secondary/50 transition-all group">
              <Mail className="w-5 h-5 text-primary group-hover:text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">{contact.email}</p>
              </div>
            </a>

            <a href={`tel:${contact.mobile}`} className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-primary hover:bg-secondary/50 transition-all group">
              <Phone className="w-5 h-5 text-primary group-hover:text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Mobile</p>
                <p className="text-sm text-foreground">{contact.mobile}</p>
              </div>
            </a>

            <a href={contact.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-primary hover:bg-secondary/50 transition-all group">
              <Linkedin className="w-5 h-5 text-primary group-hover:text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">LinkedIn</p>
                <p className="text-sm text-foreground">{contact.linkedIn}</p>
              </div>
            </a>

            <a href={contact.gitHub} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-primary hover:bg-secondary/50 transition-all group">
              <Github className="w-5 h-5 text-primary group-hover:text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">GitHub</p>
                <p className="text-sm text-foreground">{contact.gitHub}</p>
              </div>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
