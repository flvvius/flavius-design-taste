# Cycle 04: dense document library

A fresh builder created a sortable collection with keyboard selection, bulk archive/restore and undo. The independent reviewer confirmed sorting preserves selection by document ID and bulk actions recover focus, but found hidden keyboard stops in clipped headers and undersized actual checkbox targets.

The fixture now has visible mobile select-all with synchronized checked/mixed state. Hidden header controls leave the narrow keyboard sequence, while semantic headers remain available. Associated labels provide real 44px targets around compact selection glyphs. The desktop reference explains that cell padding alone does not enlarge a hit target and that responsive table controls need visible equivalents.

Original findings, baseline checks and the resolution recheck are retained. Browser checks cover both themes, narrow/wide layouts and 200% all-text enlargement. The independent touch test verifies activation outside the painted checkbox rather than trusting a cell's dimensions.
