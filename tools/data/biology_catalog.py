# tools/data/biology_catalog.py
# Authentic NCERT Biology Catalog (All 32 Chapters: Class 11 & Class 12)

def get_biology_catalog():
    cat = {}

    # ==========================================
    # CLASS 11 BIOLOGY (19 Chapters)
    # ==========================================

    # BIO-11-01: The Living World
    cat["BIO-11-01"] = [
        {
            "title": "Taxonomic Hierarchy & Binomial Nomenclature",
            "desc": "Characteristics of living organisms, biodiversity, Carolus Linnaeus's binomial nomenclature rules (ICBN and ICZN), and taxonomic hierarchy (Species, Genus, Family, Order, Class, Phylum/Division, Kingdom).",
            "notesOverview": "Taxonomy classifies biological diversity into hierarchical categories. Linnaeus established standardized Latin binomial nomenclature, identifying every organism by genus and species epithet.",
            "notesSections": [
                {
                    "heading": "Taxonomic Hierarchy and Binomial Rules",
                    "paragraphs": [
                        "Defining Properties of Life: Metabolism and cellular organization are defining features without exception; growth and reproduction are characteristics with exceptions (e.g. sterile worker bees, mules).",
                        "Binomial Nomenclature (Linnaeus): Biological names are Latinized; the first word denotes Genus (capitalized) and the second denotes Specific Epithet (lowercase). Written in italics or underlined separately when handwritten.",
                        "Taxonomic Hierarchy (Obligate Categories): Species -> Genus -> Family -> Order -> Class -> Division/Phylum -> Kingdom. Moving up from species to kingdom, the number of common characteristics decreases."
                    ],
                    "keyTakeaways": [
                        "Taxon represents a taxonomic group of any rank (e.g. Mammalia, Insecta, Chordata are all taxa).",
                        "Division is used for plants, whereas Phylum is used for animals."
                    ],
                    "examTips": ["Homo sapiens taxonomy: Genus Homo, Family Hominidae, Order Primata, Class Mammalia, Phylum Chordata, Kingdom Animalia."]
                }
            ],
            "misconceptions": ["Believing consciousness is not a defining property. Consciousness (awareness of environment and response to external stimuli) is a defining feature of all living organisms."],
            "formulas": [
                {
                    "label": "Taxonomic Species Similarity Index",
                    "formula": "\\text{Common Traits} \\propto \\frac{1}{\\text{Hierarchical Rank}} \\quad (\\text{Species} > \\text{Genus} > \\text{Family} > \\dots > \\text{Kingdom})",
                    "description": "Inverse relationship between taxonomic level height and degree of shared morphological/genetic traits.",
                    "variables": [
                        { "symbol": "\\text{Rank}", "meaning": "Taxonomic Categorical Level", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # BIO-11-02: Biological Classification
    cat["BIO-11-02"] = [
        {
            "title": "Five Kingdom System, Fungi & Acellular Entities",
            "desc": "R.H. Whittaker's 1969 Five Kingdom Classification (Monera, Protista, Fungi, Plantae, Animalia), Archaebacteria, Cyanobacteria, Fungal classes (Phycomycetes, Ascomycetes, Basidiomycetes, Deuteromycetes), Viruses, Viroids, and Lichens.",
            "notesOverview": "Whittaker organized living organisms into five kingdoms based on cell structure, body organization, mode of nutrition, reproduction, and phylogenetic relationships.",
            "notesSections": [
                {
                    "heading": "Whittaker’s Kingdoms and Acellular Pathogens",
                    "paragraphs": [
                        "Criteria for 5 Kingdoms: Cell structure (prokaryotic vs eukaryotic), thallus organization, mode of nutrition (autotrophic vs heterotrophic), reproduction, and phylogenetic relationships.",
                        "Kingdom Monera: Solely prokaryotes (bacteria). Archaebacteria survive extreme habitats due to branched-chain lipids in cell membranes (methanogens, halophiles, thermoacidophiles).",
                        "Kingdom Protista: Unicellular eukaryotes. Chrysophytes (diatoms, diatomaceous earth), Dinoflagellates (red tide caused by Gonyaulax), Euglenoids, Slime moulds, Protozoans.",
                        "Kingdom Fungi: Heterotrophic, chitinous cell walls. Ascomycetes (sac fungi, Penicillium, yeast), Basidiomycetes (club fungi, Agaricus, Puccinia rust), Deuteromycetes (imperfect fungi lacking sexual stage).",
                        "Acellular Entities: Viruses are obligate intracellular parasites with genetic material (DNA or RNA, never both) enclosed in a protein capsid. Viroids (T.O. Diener, 1971) are free infectious RNA devoid of protein coats. Prions are abnormally folded infectious proteins."
                    ],
                    "keyTakeaways": [
                        "Lichens are symbiotic associations between an algae (phycobiont, phototrophic) and fungus (mycobiont, absorbs water and minerals). Lichens are sensitive pollution bioindicators that do not grow in SO2 polluted areas.",
                        "Diatoms leave behind silica-rich cell wall deposits known as 'diatomaceous earth', used in filtration of oils and polishing."
                    ],
                    "examTips": ["Viruses were crystallized by W.M. Stanley (1935); M.W. Beijerinek (1898) coined the phrase 'Contagium vivum fluidum'."]
                }
            ],
            "misconceptions": ["Classifying viruses in Whittaker's kingdoms. Viruses, viroids, and prions have no place in Whittaker's five kingdoms because they are acellular."],
            "formulas": [
                {
                    "label": "Whittaker Classification Matrix",
                    "formula": "\\text{Organism} \\xrightarrow{\\text{Cell Type}} \\text{Prokaryota (Monera)} \\; \\& \\; \\text{Eukaryota} \\xrightarrow{\\text{Organization}} \\text{Protista / Fungi / Plantae / Animalia}",
                    "description": "Decision tree defining Whittaker's 5 kingdom taxonomic assignment.",
                    "variables": [
                        { "symbol": "\\text{Cell Type}", "meaning": "Prokaryotic vs Eukaryotic Organization", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # BIO-11-03: Plant Kingdom
    cat["BIO-11-03"] = [
        {
            "title": "Algae, Bryophytes, Pteridophytes & Gymnosperms",
            "desc": "Algal divisions (Chlorophyceae, Phaeophyceae, Rhodophyceae), Bryophytes (amphibians of plant kingdom, liverworts and mosses), Pteridophytes (vascular cryptogams, heterospory, seed habit precursor), Gymnosperms (naked seeds, Cycas and Pinus), and alternation of generations.",
            "notesOverview": "Plant evolution traces transitions from aquatic thallophytes to terrestrial embryophytes with vascular tissues and reproductive seed adaptations.",
            "notesSections": [
                {
                    "heading": "Morphological Innovations Across Plant Divisions",
                    "paragraphs": [
                        "Algae: Chlorophyceae (green, chlorophyll a & b, starch storage); Phaeophyceae (brown, chlorophyll a & c, fucoxanthin pigment, laminarin/mannitol food); Rhodophyceae (red, chlorophyll a & d, r-phycoerythrin pigment, floridean starch).",
                        "Bryophytes: 'Amphibians of plant kingdom' because they require water for flagellated antherozoid fertilization. Dominant generation is haploid gametophyte; sporophyte is dependent on gametophyte.",
                        "Pteridophytes: First terrestrial plants possessing vascular tissues (xylem and phloem). Dominant plant body is diploid sporophyte. Heterospory in Selaginella and Salvinia (producing microspores and megaspores) is an essential evolutionary precursor to the seed habit.",
                        "Gymnosperms: Ovules are not enclosed by ovary walls; seeds remain naked before and after fertilization. Cycas exhibits unbranched stem and coralloid roots with N2-fixing cyanobacteria; Pinus has mycorrhizal roots."
                    ],
                    "keyTakeaways": [
                        "Agar-agar is obtained from red algae Gelidium and Gracilaria, used to culture microbes and prepare jellies.",
                        "Peat moss Sphagnum provides fuel and packing material for trans-shipment of living material due to its immense water-holding capacity."
                    ],
                    "examTips": ["Heterospory (development of megaspores inside megasporangia retention) in Pteridophytes Selaginella is considered the decisive milestone toward the evolution of the seed habit!"]
                }
            ],
            "misconceptions": ["Believing gymnosperms produce fruits. Fruits develop exclusively from ovary walls; gymnosperms lack ovaries and therefore produce naked seeds."],
            "formulas": [
                {
                    "label": "Alternation of Generations Ratio",
                    "formula": "\\text{Haplontic: } n \\text{ dominant (zygotic meiosis)}, \\quad \\text{Diplontic: } 2n \\text{ dominant (gametic meiosis)}",
                    "description": "Ploidy cycle across algal versus gymnosperm/angiosperm lifecycles.",
                    "variables": [
                        { "symbol": "n, 2n", "meaning": "Haploid and Diploid Ploidy States", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # BIO-11-04: Animal Kingdom
    cat["BIO-11-04"] = [
        {
            "title": "Basis of Classification & Animal Phyla",
            "desc": "Levels of organization, symmetry (radial vs bilateral), diploblastic vs triploblastic, coelom (acoelomate, pseudocoelomate, coelomate), non-chordate phyla (Porifera to Hemichordata), and Chordate classes (Chondrichthyes, Osteichthyes, Amphibia, Reptilia, Aves, Mammalia).",
            "notesOverview": "Animal taxonomy is categorized by fundamental body architecture: germ layers, body symmetry, gut openings, coelom segmentation, and notochord development.",
            "notesSections": [
                {
                    "heading": "Body Plans and Diagnostic Phylum Features",
                    "paragraphs": [
                        "Porifera: Cellular grade, canal system (ostia -> spongocoel -> osculum), choanocytes (collar cells) line spongocoel.",
                        "Cnidaria / Coelenterata: Tissue grade, radial symmetry, cnidoblasts with stinging capsules (nematocysts), metagenesis (alternation between polyp and medusa in Obelia).",
                        "Platyhelminthes: Flatworms, bilateral symmetry, triploblastic, acoelomate, flame cells for osmoregulation.",
                        "Aschelminthes / Nematoda: Pseudocoelomate, roundworms with complete alimentary canal and muscular pharynx.",
                        "Annelida: Metameric segmentation, true coelom, closed circulatory system, nephridia for excretion.",
                        "Arthropoda: Largest phylum, chitinous exoskeleton, jointed appendages, Malpighian tubules for excretion, open circulation.",
                        "Mollusca: Second largest phylum, soft unsegmented body covered by calcareous shell, radula feeding organ.",
                        "Echinodermata: Spiny skinned, water vascular system for locomotion and food capture, adult radial and larval bilateral symmetry.",
                        "Chordata: Possess notochord, dorsal hollow nerve cord, pharyngeal gill slits, and post-anal tail at some stage of development."
                    ],
                    "keyTakeaways": [
                        "Aschelminthes are the ONLY pseudocoelomate phylum in the animal kingdom.",
                        "Echinoderms exhibit secondary radial symmetry: larvae are bilaterally symmetrical, but adults are pentaradial."
                    ],
                    "examTips": ["Chordates vs Non-chordates: Chordates have dorsal hollow single nerve cord, ventral heart, and post-anal tail; non-chordates have ventral solid double nerve cord and dorsal heart."]
                }
            ],
            "misconceptions": ["Believing adult echinoderms are primitive because of radial symmetry. Echinoderms are advanced deuterostomes that secondarily evolved radial symmetry from bilateral ancestors."],
            "formulas": [
                {
                    "label": "Animal Body Plan Coelomic Stratification",
                    "formula": "\\text{Acoelomate (Flatworms)} \\subset \\text{Pseudocoelomate (Roundworms)} \\subset \\text{Coelomate (Annelids to Chordates)}",
                    "description": "Evolutionary progression of the body cavity (coelom).",
                    "variables": [
                        { "symbol": "\\text{Coelom}", "meaning": "Mesoderm-lined Secondary Body Cavity", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # BIO-11-05: Morphology of Flowering Plants
    cat["BIO-11-05"] = [
        {
            "title": "Root, Stem, Leaf Modifications, Inflorescence & Flower",
            "desc": "Root regions and modifications (pneumatophores, prop roots), stem modifications (tendrils, phylloclades), leaf venation and phyllotaxy, inflorescence (racemose vs cymose), flower floral parts, placentation types, and semi-technical family descriptions.",
            "notesOverview": "Angiosperm morphology explores organ adaptations for support, storage, aeration, and reproductive pollination across diverse ecological niches.",
            "notesSections": [
                {
                    "heading": "Floral Architecture and Placentation Schemes",
                    "paragraphs": [
                        "Root Regions: Root cap -> Region of meristematic activity -> Region of elongation (responsible for root growth) -> Region of maturation (produces epidermal root hairs for absorption).",
                        "Modifications: Pneumatophores in Rhizophora grow vertically upward for respiration in saline swamps; prop roots in banyan tree for mechanical support.",
                        "Placentation Types: Marginal (pea), Axile (tomato, lemon, china rose), Parietal (mustard, Argemone), Free-central (Dianthus, Primrose), Basal (sunflower, marigold).",
                        "Flower Symmetry: Actinomorphic (radial: mustard, datura, chilli); Zygomorphic (bilateral: pea, gulmohur, bean, cassia); Asymmetric (canna)."
                    ],
                    "keyTakeaways": [
                        "In basal placentation, single ovule is attached at the base of unilocular ovary (sunflower, marigold).",
                        "Phylloclades are flattened, green photosynthetic stems in xerophytes (Opuntia, Euphorbia) where leaves are reduced to spines to prevent transpiration."
                    ],
                    "examTips": ["Distinguish between Solanaceae (bicarpellary, obligately placed, axile placentation, persistent calyx) and Fabaceae (diadelphous stamens 9+1, vexillary aestivation)."]
                }
            ],
            "misconceptions": ["Confusing phylloclade with phyllode. Phylloclade is a modified photosynthetic stem (Opuntia); phyllode is a modified photosynthetic petiole (Australian acacia)."],
            "formulas": [
                {
                    "label": "Floral Formula Conventions",
                    "formula": "\\% \\; \\text{K}_{(5)} \\; \\text{C}_{1+2+(2)} \\; \\text{A}_{(9)+1} \\; \\underline{\\text{G}}_1 \\quad (\\text{Fabaceae Family Formula})",
                    "description": "Standardized floral diagram shorthand representing floral organ symmetries and counts.",
                    "variables": [
                        { "symbol": "\\%", "meaning": "Zygomorphic Symmetry", "unit": "-" },
                        { "symbol": "\\underline{\\text{G}}", "meaning": "Superior Ovary", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # BIO-11-06: Anatomy of Flowering Plants
    cat["BIO-11-06"] = [
        {
            "title": "Meristems, Plant Tissues & Internal Anatomy of Dicot/Monocot",
            "desc": "Meristematic tissues (apical, intercalary, lateral), simple tissues (parenchyma, collenchyma, sclerenchyma), complex tissues (xylem tracheids/vessels and phloem sieve tubes/companion cells), epidermal, ground, and vascular tissue systems, anatomy of dicot and monocot root, stem, and leaf.",
            "notesOverview": "Plant anatomy analyzes histological cell arrangements. Monocot and dicot organs diverge in vascular bundle arrangements, secondary growth capacity, and stomatal configurations.",
            "notesSections": [
                {
                    "heading": "Tissue Systems and Organ Cross-Sections",
                    "paragraphs": [
                        "Xylem: Tracheids and vessels (dead at maturity, lignified walls for water transport). Vessels are absent in gymnosperms (tracheids only). Xylem parenchyma is the only living xylem element.",
                        "Phloem: Sieve tube elements (enucleated at maturity, connected by companion cells), phloem parenchyma, and phloem fibres.",
                        "Dicot Stem vs Monocot Stem: Dicot stem has vascular bundles arranged in a ring, open with cambium (capable of secondary growth); Monocot stem has scattered vascular bundles, closed without cambium, surrounded by sclerenchymatous bundle sheath.",
                        "Dicot Root vs Monocot Root: Dicot root has 2 to 4 (diarch to tetrarch) xylem bundles; Monocot root has polyarch (more than 6) xylem bundles with large, well-developed pith."
                    ],
                    "keyTakeaways": [
                        "Collenchyma provides mechanical support to growing parts (young stems, petioles) and has pectin thickenings at corners.",
                        "Casparian strips in root endodermis are made of impermeable waxy suberin, forcing symplastic radial water movement."
                    ],
                    "examTips": ["Protoxylem orientation: Stem has ENDARCH xylem (protoxylem inside, metaxylem outside); Root has EXARCH xylem (protoxylem outside, metaxylem inside)."]
                }
            ],
            "misconceptions": ["Believing mature sieve tube elements are dead because they lack nuclei. Mature sieve tubes are living; their cytoplasmic functions are governed by companion cells via plasmodesmata."],
            "formulas": [
                {
                    "label": "Vascular Bundle Orientation Index",
                    "formula": "\\text{Root: Exarch } (\\text{Protoxylem Outward}), \\quad \\text{Stem: Endarch } (\\text{Protoxylem Inward})",
                    "description": "Anatomical differentiation rule for primary xylem development.",
                    "variables": [
                        { "symbol": "\\text{Protoxylem}", "meaning": "First Formed Primary Xylem", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # BIO-11-07: Structural Organisation in Animals
    cat["BIO-11-07"] = [
        {
            "title": "Epithelial, Connective, Muscular & Frog Anatomy",
            "desc": "Animal tissues: epithelial (squamous, cuboidal, columnar, ciliated), cell junctions (tight, adhering, gap), connective (areolar, adipose, bone, cartilage, blood), muscular (skeletal, smooth, cardiac), and morphology and organ systems of frog (Rana tigrina).",
            "notesOverview": "Animal histology coordinates specialized cell lineages into functional tissues. Frog anatomy serves as the representative vertebrate model for circulatory, digestive, and urogenital physiology.",
            "notesSections": [
                {
                    "heading": "Tissue Junctions and Frog Physiology",
                    "paragraphs": [
                        "Epithelial Tissues: Squamous (diffusion boundary, lung alveoli, blood capillary walls); Cuboidal (absorption and secretion, nephron tubules); Columnar (stomach and intestine lining with microvilli).",
                        "Cell Junctions: Tight junctions prevent leakage across epithelial sheet; Adhering junctions cement neighboring cells together; Gap junctions facilitate rapid ionic communication and electrical coupling.",
                        "Muscular Tissues: Skeletal (striated, voluntary, multinucleated); Smooth (unstriated, spindle-shaped, involuntary, uninucleate); Cardiac (striated, involuntary, with intercalated discs containing gap junctions).",
                        "Frog (Rana tigrina): Poikilothermic (cold-blooded), cutaneous and pulmonary respiration, 3-chambered heart (two atria, one ventricle), hepatic and renal portal systems, ureotelic excretion."
                    ],
                    "keyTakeaways": [
                        "Intercalated discs in cardiac muscle allow rapid wave-like transmission of electrical depolarization across the heart.",
                        "Frog RBCs are nucleated, oval, and contain hemoglobin (unlike non-nucleated biconcave mammalian RBCs)."
                    ],
                    "examTips": ["In male frogs, Bidder’s canal is located inside the kidney and serves for passage of spermatozoa into the urogenital duct."]
                }
            ],
            "misconceptions": ["Assuming frog heart has two ventricles. Amphibians possess a 3-chambered heart with two atria and a single undivided ventricle where oxygenated and deoxygenated blood mix partially."],
            "formulas": [
                {
                    "label": "Cardiac Chamber Ratio in Vertebrate Evolution",
                    "formula": "\\text{Fish (2-chamber)} \\longrightarrow \\text{Amphibian/Reptile (3-chamber)} \\longrightarrow \\text{Bird/Mammal (4-chamber)}",
                    "description": "Evolutionary sequence of vertebrate cardiovascular septation.",
                    "variables": [
                        { "symbol": "\\text{Chambers}", "meaning": "Heart Cavities Count", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # BIO-11-08: Cell: The Unit of Life
    cat["BIO-11-08"] = [
        {
            "title": "Fluid Mosaic Model, Endomembrane System & Organelles",
            "desc": "Cell theory (Schleiden, Schwann, Virchow omnis cellula-e-cellula), prokaryotic vs eukaryotic cells, Singer-Nicolson Fluid Mosaic Model, endomembrane system (ER, Golgi apparatus, lysosomes, vacuoles), mitochondria (semi-autonomous, 70S ribosomes), plastids, and 9+2 axoneme cilia/flagella.",
            "notesOverview": "The cell is the structural and functional unit of all life. Eukaryotes compartmentalize cellular metabolic processes within specialized membrane-bound organelles.",
            "notesSections": [
                {
                    "heading": "Membrane Architecture and Endomembrane Coordination",
                    "paragraphs": [
                        "Fluid Mosaic Model (Singer & Nicolson, 1972): Phospholipid bilayer with polar hydrophilic heads facing outward and non-polar hydrophobic fatty acid tails facing inward. Quasi-fluid nature of lipids enables lateral movement of proteins within membrane.",
                        "Endomembrane System: Group of organelles whose functions are coordinated: Endoplasmic Reticulum (RER for protein synthesis, SER for lipid synthesis), Golgi apparatus (packaging and glycosylation of proteins into glycoproteins/glycolipids), Lysosomes (acid hydrolases optimal at pH 5), and Vacuoles.",
                        "Mitochondria: Double-membraned powerhouses. Outer membrane smooth, inner membrane folded into cristae to increase surface area for ATP synthesis (F0-F1 ATP synthase complexes). Contain circular dsDNA, 70S ribosomes, dividing by fission (endosymbiotic origin).",
                        "Chloroplasts: Stroma containing thylakoids stacked into grana. Thylakoid membranes contain chlorophyll pigments.",
                        "Cilia and Flagella: 9 + 2 microtubule doublet axoneme pattern anchored to basal body."
                    ],
                    "keyTakeaways": [
                        "Peroxisomes, mitochondria, and chloroplasts are NOT part of the endomembrane system because their functions are not coordinated with ER/Golgi.",
                        "Eukaryotic ribosomes are 80S (60S + 40S subunits); prokaryotic, mitochondrial, and plastid ribosomes are 70S (50S + 30S subunits)."
                    ],
                    "examTips": ["Golgi apparatus has polarity: convex 'cis' face is forming/receiving face facing ER; concave 'trans' face is maturing/releasing face delivering vesicles."]
                }
            ],
            "misconceptions": ["Believing all eukaryotic organelles are double-membraned. Lysosomes and vacuoles are single-membraned; ribosomes and centrioles are non-membranous."],
            "formulas": [
                {
                    "label": "Ribosomal Svedberg Sedimentation Subunits",
                    "formula": "70\\text{S} = 50\\text{S} + 30\\text{S} \\; (\\text{Prokaryotes/Mitochondria}), \\quad 80\\text{S} = 60\\text{S} + 40\\text{S} \\; (\\text{Eukaryotic Cytoplasm})",
                    "description": "Sedimentation coefficient Svedberg (S) non-additive subunit relationships.",
                    "variables": [
                        { "symbol": "\\text{S}", "meaning": "Svedberg Unit (Sedimentation Rate)", "unit": "10^{-13} \\text{ s}" }
                    ]
                }
            ]
        }
    ]

    # BIO-11-09: Biomolecules
    cat["BIO-11-09"] = [
        {
            "title": "Enzyme Kinetics, Michaelis-Menten & Inhibition",
            "desc": "Amino acids (zwitterions), carbohydrates, lipids, nucleotides, primary/secondary/tertiary/quaternary protein structures, enzymes as biocatalysts, activation energy reduction, Michaelis-Menten Vmax and Km, competitive vs non-competitive inhibition.",
            "notesOverview": "Enzymes are specialized protein catalysts accelerating biochemical reactions by lowering activation energy barriers. Enzyme kinetics characterizes catalytic efficiency and substrate affinity.",
            "notesSections": [
                {
                    "heading": "Enzyme Mechanism and Inhibition Models",
                    "paragraphs": [
                        "Catalytic Action: Enzymes lower activation energy (Ea) without altering the equilibrium constant or net Delta G of the reaction.",
                        "Michaelis Constant (Km): Substrate concentration at which reaction rate reaches exactly half of maximum velocity (Vmax / 2). Lower Km indicates higher enzyme affinity for substrate.",
                        "Competitive Inhibition: Inhibitor closely resembles substrate in structure and competes for the active site (e.g. malonate inhibits succinate dehydrogenase). Vmax remains unchanged; apparent Km increases. Overcome by adding excess substrate.",
                        "Non-Competitive Inhibition: Inhibitor binds to allosteric site altering enzyme conformation. Vmax decreases; Km remains unchanged."
                    ],
                    "keyTakeaways": [
                        "Co-factors: Prosthetic groups (tightly bound organic: e.g. haem in catalase), Co-enzymes (transient organic, derived from vitamins: e.g. NAD, NADP), Metal ions (e.g. Zn2+ in carboxypeptidase).",
                        "Apoenzyme + Co-factor = Holoenzyme (active catalytic complex)."
                    ],
                    "examTips": ["Competitive inhibition: Km increases, Vmax constant. Non-competitive inhibition: Km constant, Vmax decreases. Memorize this exact comparison for NEET!"]
                }
            ],
            "misconceptions": ["Believing enzymes change the free energy Delta G of a reaction. Enzymes alter only the activation energy barrier Ea, leaving Delta G and Keq completely untouched."],
            "formulas": [
                {
                    "label": "Michaelis-Menten Enzyme Kinetics",
                    "formula": "v = \\frac{V_{\\max} [S]}{K_m + [S]}, \\quad \\text{At } v = \\frac{V_{\\max}}{2}, \\; [S] = K_m",
                    "description": "Fundamental hyperbolic rate equation for single-substrate enzyme catalyzed reactions.",
                    "variables": [
                        { "symbol": "v", "meaning": "Reaction Velocity", "unit": "mol/(L s)" },
                        { "symbol": "V_{\\max}", "meaning": "Maximum Velocity", "unit": "mol/(L s)" },
                        { "symbol": "K_m", "meaning": "Michaelis Constant", "unit": "mol/L" },
                        { "symbol": "[S]", "meaning": "Substrate Concentration", "unit": "mol/L" }
                    ]
                }
            ]
        }
    ]

    # BIO-11-10: Cell Cycle and Cell Division
    cat["BIO-11-10"] = [
        {
            "title": "Mitosis, Meiosis, Synaptonemal Complex & Crossing Over",
            "desc": "Cell cycle phases (G1, S, G2, M, G0 quiescent stage), DNA replication in S phase, stages of mitosis (prophase, metaphase, anaphase, telophase), stages of meiosis I (leptotene, zygotene, pachytene, diplotene, diakinesis), synaptonemal complex, crossing over by recombinase, and meiosis II.",
            "notesOverview": "The cell cycle ensures faithful genetic replication and partitioning. Mitosis produces genetically identical diploid clones; meiosis introduces genetic recombination through crossing over and halves the chromosome count for sexual reproduction.",
            "notesSections": [
                {
                    "heading": "Meiotic Recombination and Chromosome Segregation",
                    "paragraphs": [
                        "Interphase: G1 (cell growth), S phase (DNA replication: DNA content doubles from 2C to 4C, chromosome count remains 2n), G2 (protein synthesis for spindle). Quiescent stage (G0): metabolically active but non-dividing.",
                        "Mitosis: Metaphase (chromosomes align on equatorial metaphase plate, kinetochores attach to spindle fibres); Anaphase (centromeres split, sister chromatids migrate to opposite poles).",
                        "Meiosis I Prophase I Sub-stages: (1) Leptotene: chromatin condenses; (2) Zygotene: homologous chromosomes pair (synapsis) mediated by synaptonemal complex forming bivalents; (3) Pachytene: crossing over between non-sister chromatids mediated by enzyme recombinase; (4) Diplotene: dissolution of synaptonemal complex, X-shaped chiasmata become visible; (5) Diakinesis: terminalisation of chiasmata.",
                        "Anaphase I: Homologous chromosomes separate while sister chromatids remain associated at their centromeres (reductional division: 2n -> n)."
                    ],
                    "keyTakeaways": [
                        "During S phase, DNA content doubles (2C -> 4C), but chromosome number does NOT change (remains 2n).",
                        "Centromere division occurs during Anaphase of Mitosis and Anaphase II of Meiosis, but NEVER during Anaphase I."
                    ],
                    "examTips": ["Oocytes of some vertebrates remain arrested in diplotene of meiosis I for months or years (dictyotene stage)."]
                }
            ],
            "misconceptions": ["Assuming centromeres split during Anaphase I. In Anaphase I, homologous chromosomes disjoin, keeping centromeres intact. Centromeres split only in Anaphase II."],
            "formulas": [
                {
                    "label": "Cell Division Ploidy and DNA Content Ratios",
                    "formula": "\\text{G}_1(2n, 2C) \\xrightarrow{\\text{S phase}} (2n, 4C) \\xrightarrow{\\text{Meiosis I}} (n, 2C) \\xrightarrow{\\text{Meiosis II}} 4 \\times (n, C)",
                    "description": "Tracking chromosome ploidy (n) versus DNA mass (C) throughout meiotic division.",
                    "variables": [
                        { "symbol": "n", "meaning": "Chromosome Number", "unit": "-" },
                        { "symbol": "C", "meaning": "DNA Mass Equivalent", "unit": "pg" }
                    ]
                }
            ]
        }
    ]

    # Merge all remaining Class 11 and Class 12 chapters
    from biology_part2 import BIOLOGY_PART2
    cat.update(BIOLOGY_PART2)

    return cat

if __name__ == "__main__":
    cat = get_biology_catalog()
    print("Total Biology chapters loaded:", len(cat))
    for code, topics in cat.items():
        print(f"  {code}: {len(topics)} topics")
