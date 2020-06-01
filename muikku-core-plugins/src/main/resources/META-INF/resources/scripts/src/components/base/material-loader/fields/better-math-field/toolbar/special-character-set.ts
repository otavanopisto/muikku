export interface SpecialCharacterType {
  character: string,
  latexCommand: string,
  popular?: boolean
}

export default [
    {
        label: 'basicsAndSymbols',
        characters: [
            { character: '°', popular: true },
            { character: '·', latexCommand: '\\cdot', popular: true },
            { character: '±', latexCommand: '\\pm', popular: true },
            { character: '∞', latexCommand: '\\infty', popular: true },
            { character: '²', latexCommand: '^2', popular: true },
            { character: '³', latexCommand: '^3', popular: true },
            { character: '½', latexCommand: '1/2', popular: true },
            { character: '⅓', latexCommand: '1/3', popular: true },
            { character: 'π', latexCommand: '\\pi', popular: true },
            { character: 'α', latexCommand: '\\alpha', popular: true },
            { character: 'β', latexCommand: '\\beta', popular: true  },
            { character: 'Γ', latexCommand: '\\Gamma' },
            { character: 'γ', latexCommand: '\\gamma' },
            { character: 'Δ', latexCommand: '\\Delta' },
            { character: 'δ', latexCommand: '\\delta' },
            { character: 'ε', latexCommand: '\\varepsilon' },
            { character: 'ζ', latexCommand: '\\zeta' },
            { character: 'η', latexCommand: '\\eta' },
            { character: 'θ', latexCommand: '\\theta' },
            { character: 'ϑ', latexCommand: '\\vartheta' },
            { character: '&iota;', latexCommand: '\\iota' },
            { character: 'κ', latexCommand: '\\kappa' },
            { character: 'Λ', latexCommand: '\\Lambda' },
            { character: 'λ', latexCommand: '\\lambda' },
            { character: 'µ', latexCommand: '\\mu' },
            { character: 'ν', latexCommand: '\\nu' },
            { character: 'Ξ', latexCommand: '\\Xi' },
            { character: 'ξ', latexCommand: '\\xi' },
            { character: '∏', latexCommand: '\\Pi' },
            { character: 'ρ', latexCommand: '\\rho' },
            { character: '∑', latexCommand: '\\Sigma' },
            { character: 'σ', latexCommand: '\\sigma' },
            { character: 'τ', latexCommand: '\\tau' },
            { character: 'Υ', latexCommand: '\\Upsilon' },
            { character: 'υ', latexCommand: '\\upsilon' },
            { character: 'Φ', latexCommand: '\\Phi' },
            { character: 'Ф', latexCommand: '\\phi' },
            { character: 'χ', latexCommand: '\\chi' },
            { character: 'Ψ', latexCommand: '\\Psi' },
            { character: 'ψ', latexCommand: '\\psi' },
            { character: 'Ω', latexCommand: '\\Omega' },
            { character: 'ω', latexCommand: '\\omega' },
            { character: '∂', latexCommand: '\\partial' },
            { character: 'φ', latexCommand: '\\varphi' }
        ]
    },
    {
        label: 'algebra',
        characters: [
            { character: '≠', latexCommand: '\\neq', popular: true },
            { character: '≈', latexCommand: '\\approx', popular: true },
            { character: '≤', latexCommand: '\\leq', popular: true },
            { character: '≥', latexCommand: '\\geq' },
            { character: '<' },
            { character: '>' },
            { character: '∼', latexCommand: '\\sim' },
            { character: '≡', latexCommand: '\\equiv' },
            { character: '≢', latexCommand: '\\not\\equiv' },
            { character: '∘', latexCommand: '\\circ' },
            { character: '…', latexCommand: '\\ldots' },
            { character: '∝', latexCommand: '\\propto' }
        ]
    },
    {
        label: 'geometryAndVectors',
        characters: [
            { character: '∢', latexCommand: '\\sphericalangle', popular: true },
            { character: '|' , latexCommand: '\\mid', popular: true }, // \pipe,
            { character: '‖', latexCommand: '\\parallel', popular: true},
            { character: '⇌', latexCommand: '\\xrightleftharpoons', noWrite: true},
            { character: '⇅' },
            { character: '∠', latexCommand: '\\angle' },
            { character: '↑', latexCommand: '\\uparrow' },
            { character: '↗', latexCommand: '\\nearrow' },
            { character: '↘', latexCommand: '\\searrow' },
            { character: '↓', latexCommand: '\\downarrow' },
            { character: '↔', latexCommand: '\\leftrightarrow' },
            { character: '⊥', latexCommand: '\\perp'}
        ]
    },
    {
        label: 'logic',
        characters: [
            { character: '→', latexCommand: '\\rightarrow', popular: true },
            { character: '⇒', latexCommand: '\\Rightarrow', popular: true },
            { character: '∈', latexCommand: '\\in', popular: true },
            { character: 'ℤ', latexCommand: '\\mathbb{Z}', popular: true },
            { character: 'ℝ', latexCommand: '\\mathbb{R}', popular: true },
            { character: '⇔', latexCommand: '\\Leftrightarrow' },
            { character: '∃', latexCommand: '\\exists' },
            { character: '∀', latexCommand: '\\forall' },
            { character: 'ℕ', latexCommand: '\\mathbb{N}' },
            { character: 'ℚ', latexCommand: '\\mathbb{Q}' },
            { character: '∩', latexCommand: '\\cap' },
            { character: '∪', latexCommand: '\\cup' },
            { character: '∖', latexCommand: '\\setminus' },
            { character: '⊂', latexCommand: '\\subset' },
            { character: '⊄', latexCommand: '\\notsubset' },
            { character: '∉', latexCommand: '\\notin' },
            { character: '∅', latexCommand: '\\empty' },
            { character: '∧', latexCommand: '\\and' },
            { character: '∨', latexCommand: '\\or' },
            { character: '¬' }
        ]
    }
]
