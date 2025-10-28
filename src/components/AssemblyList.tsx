
import React from 'react';
import { Assembly } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X } from 'lucide-react';
import AssemblyCard from '@/components/AssemblyCard';
import NewAssemblyDialog from '@/components/NewAssemblyDialog';
import YearSelect from '@/components/registers/YearSelect';
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
  const [selectedYear, setSelectedYear] = React.useState<string>('all');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const years = React.useMemo(() => {
    const uniqueYears = [...new Set(assemblies.map(a => 
      new Date(a.date).getFullYear()
    ))].sort((a, b) => b - a);
    return uniqueYears;
  }, [assemblies]);

  const filteredAssemblies = React.useMemo(() => {
    let filtered = assemblies;
    
    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(assembly => {
        const year = new Date(assembly.date).getFullYear();
        return year.toString() === selectedYear;
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(assembly => 
        assembly.name.toLowerCase().includes(query) ||
        assembly.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [assemblies, selectedYear, searchQuery]);

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
      {/* Header - Non-sticky on mobile */}
      <div className={cn(
        "md:sticky md:top-0 z-10 bg-[hsl(var(--lavender-bg))]/95 md:backdrop-blur-sm md:border-b transition-all duration-300",
        isScrolled && "md:shadow-sm"
      )}>
        <div className="p-2 md:p-4 space-y-2 md:space-y-3">
          {/* Title Row */}
          <div className={cn(
            "flex justify-between items-center transition-all duration-300"
          )}>
            <div className="flex items-center gap-2 md:gap-3">
              <h2 className={cn(
                "font-bold transition-all duration-300",
                "text-xl md:text-2xl",
                searchExpanded && "hidden md:block"
              )}>
                Assemblees
              </h2>
              <span className="text-xs md:text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {filteredAssemblies.length}
              </span>
            </div>
            <Button onClick={() => setShowNewDialog(true)} className="shrink-0 hidden md:inline-flex">
              <Plus className="mr-2 h-4 w-4" />
              Nova Assemblea
            </Button>
          </div>

          {/* Year Filter and Search Bar */}
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <YearSelect 
              value={selectedYear}
              years={years}
              onValueChange={setSelectedYear}
            />
            <div className={cn(
              "flex items-center gap-2 transition-all duration-300 flex-1",
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
      </div>

      {/* Assembly List */}
      <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-200px)] md:h-[calc(100vh-330px)]">
        <div className="space-y-3 md:space-y-4 px-2 md:px-4 py-3 md:py-4 md:pr-6">
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
