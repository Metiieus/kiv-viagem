export const theme = {
  colors: {
    // Primary Brand (Verde Água / Teal)
    primary: "#0D9488", // Teal 600 - Cor sólida e profissional
    primaryDark: "#0F766E", // Teal 700
    primaryLight: "#2DD4BF", // Teal 400

    // Secondary/Accent (Pode manter o Violet ou mudar para algo que combine)
    // Vamos usar um Laranja suave para contraste ou manter um tom neutro frio
    secondary: "#5EEAD4", // Teal 300 - Mais vibrante para badges

    // State
    success: "#10B981", // Emerald 500
    warning: "#F59E0B", // Amber 500
    error: "#EF4444", // Red 500
    info: "#06B6D4", // Cyan 500

    // Neutrals (Mantendo o Slate que ficou bom)
    text: "#1E293B", // Slate 800
    textSecondary: "#64748B", // Slate 500
    textLight: "#94A3B8", // Slate 400

    background: "#F0FDFA", // Teal 50 - Fundo beeeem clarinho levemente esverdeado
    surface: "#FFFFFF", // Pure white
    border: "#CCFBF1", // Teal 100 - Bordas sutis
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    s: 8,
    m: 12,
    l: 24,
    xl: 32,
    full: 9999,
  },
  shadows: {
    none: {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    small: {
      shadowColor: "#0F766E", // Sombra levemente tintada
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: "#0F766E",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: "#0F766E",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 10,
    },
  },
  typography: {
    sizes: {
      xs: 12,
      s: 14,
      m: 16,
      l: 20,
      xl: 24,
      xxl: 32,
    },
    weights: {
      regular: "400",
      medium: "600",
      bold: "700",
      extraBold: "800",
    }
  }
};