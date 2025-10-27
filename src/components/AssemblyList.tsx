
import React from 'react';
import { Assembly } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X } from 'lucide-react';
import AssemblyCard from '@/components/AssemblyCard';
import NewAssemblyDialog from '@/components/NewAssemblyDialog';
import { cn } from '@/lib/utils';

interface AssemblyListProps {
  assemblies: Assembly[];
  onAssemblySelected: (assemblyId: string) => void;
  onAssemblyEdited: () => void;
  onAssemblyCreated: () => void;
}

const AssemblyList = ({ assemblies, onAssemblySelected, onAssemblyEdited, onAssemblyCreated }: AssemblyListProps) => {
  const [showNewDialog, setShowNewDialog] = React.useState(false);
  const [searchExpanded, setSearchExpanded] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const filteredAssemblies = React.useMemo(() => {
    if (!searchQuery.trim()) return assemblies;
    
    const query = searchQuery.toLowerCase();
    return assemblies.filter(assembly => 
      assembly.name.toLowerCase().includes(query) ||
      assembly.description?.toLowerCase().includes(query)
    );
  }, [assemblies, searchQuery]);

  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsScrolled(target.scrollTop > 20);
    };

    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    scrollElement?.addEventListener('scroll', handleScroll);

    return () => scrollElement?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchExpanded(false);
  };

  return (
    <div className="space-y-0 pb-20 md:pb-0">
      {/* Sticky Header */}
      <div className={cn(
        "sticky top-0 z-10 bg-[hsl(var(--lavender-bg))]/95 backdrop-blur-sm border-b transition-all duration-300",
        isScrolled ? "shadow-sm" : ""
      )}>
        <div className="p-4 space-y-3">
          {/* Title Row - Collapses on scroll for mobile */}
          <div className={cn(
            "flex justify-between items-center transition-all duration-300",
            isScrolled && "md:mb-0"
          )}>
            <div className="flex items-center gap-3">
              <h2 className={cn(
                "font-bold transition-all duration-300",
                isScrolled ? "text-lg md:text-2xl" : "text-2xl",
                searchExpanded && "md:block hidden"
              )}>
                Assemblees
              </h2>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {filteredAssemblies.length}
              </span>
            </div>
            <Button onClick={() => setShowNewDialog(true)} className="shrink-0 hidden md:inline-flex">
              <Plus className="mr-2 h-4 w-4" />
              Nova Assemblea
            </Button>
          </div>

          {/* Search Bar */}
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            searchExpanded ? "w-full" : "w-auto"
          )}>
            {!searchExpanded ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchExpanded(true)}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Cercar</span>
              </Button>
            ) : (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cercar per nom o descripció..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assembly List */}
      <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-280px)] md:h-[calc(100vh-330px)]">
        <div className="space-y-3 md:space-y-4 p-4 pr-6">
          {filteredAssemblies.map((assembly) => (
            <AssemblyCard
              key={assembly.id}
              assembly={assembly}
              onClick={() => onAssemblySelected(assembly.id)}
              onEdited={onAssemblyEdited}
            />
          ))}
          {filteredAssemblies.length === 0 && (
            <div className="text-center text-muted-foreground py-6 md:py-8">
              {searchQuery ? 'No s\'han trobat assemblees' : 'No hi ha assemblees. Crea\'n una de nova!'}
            </div>
          )}
        </div>
      </ScrollArea>

      <NewAssemblyDialog 
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onAssemblyCreated={() => {
          onAssemblyCreated();
          setShowNewDialog(false);
        }}
      />

      {/* FAB for mobile */}
      <button
        onClick={() => setShowNewDialog(true)}
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-50 flex items-center justify-center"
        aria-label="Nova Assemblea"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default AssemblyList;
