// Themes.js
export const themes = [
    {
        name: 'Default',
        textColor: '#22223b', // Dark gray for better readability
        textSize: '16px', // A more standard size for readability
        bgColor: '#FFFFFF', // White background for a clean look
        primaryColor: '#032b43', // A lighter blue for primary actions
        secondaryColor: '#F2F2F2', // Light gray for secondary elements and backgrounds
        iconColor: '#5B9BD5', // Icons use the primary color
        borderColor: '#E0E0E0', // A very light gray for borders
        searchBackgroundColor: '#F2F2F2', // A light gray for the search input
        borderHoverColor: '#DDDDDD', // A lighter gray for borders on hover
        borderFocusColor: '#5B9BD5', // A lighter blue for borders when focused
        borderFocusShadow: '#DDDDDD',
        tableHeaderBgColor: '#F2F2F2', // A light gray for the table header
        tableLightColor: '#212121', // A light gray for the table rows
        tableArrowsColor: '#F2F2F2', // A light gray for the table rows on hover
        borderBottom: '1px solid #E0E0E0',
        layoutColor: 'f5ebe0',
        description: 'A default theme for everyday use',
        icon: 'brightness_1',
        isAccessibilityFocused: false,
      },
      {
        name: 'Blue',
        textColor: '#051923',
        textSize: '14px',
        bgColor: '#a9d6e5', // A darker shade of blue for the background
        primaryColor: '#1E88E5', // A slightly lighter blue for primary actions
        secondaryColor: '#4FC3F7', // Even lighter blue for secondary elements
        iconColor: '#FFFFFF', // White icons for better contrast on blue
        borderBottom: '1px solid #004D40',
        tableHeaderBgColor: '#1565c0', // A light gray for the table header
        tableLightColor: '#212121', // A light gray for the table rows
        tableArrowsColor: '#F2F2F2', // A light gray for the table rows on hover
        description: 'Cool and calming blue, ideal for focused work',
        icon: 'invert_colors',
        isAccessibilityFocused: false,
      },
      
      {
        name: 'Green',
        textColor: '#ffffff', // Dark teal for text, which is more subdued than pure black
        textSize: '14px',
        bgColor: '#dde5b6', // Soft green for the background
        primaryColor: '#388E3C', // A strong green for calls to action
        linkColor: '#032b43', // A strong green for links, which is more prominent than the primary color
        linkHoverColor: '#2E7D32', // A lighter green for links when hovered over, which is more prominent than the primary color
        linkActiveColor: '#1B5E20', // A darker green for links when active, which is more prominent than the primary color
        linkVisitedColor: '#1B5E20', // A darker green for links when visited, which is more prominent than the primary color
        primaryHoverColor: '#2E7D32', // A lighter green for primary actions when hovered over, which is more prominent than the primary color
        primaryActiveColor: '#1B5E20', // A darker green for primary actions when active, which is more prominent than the primary color
        primaryVisitedColor: '#1B5E20', // A darker green for primary actions when visited, which is more prominent than the primary color
        primaryFocusColor: '#1B5E20', // A darker green for primary actions when focused, which is more prominent than the primary color
        secondaryColor: '#C8E6C9', // Light green for secondary elements
        iconColor: '#3e8914', // Matching the text color for consistency
        tableHeaderBgColor: '#656d4a', // A light gray for the table header
        tableLightColor: '#212121', // A light gray for the table rows
        tableArrowsColor: '#c2c5aa', // A light gray for the table rows on hover
        borderBottom: '1px solid #004D40',
        layoutColor: 'e9edc9', // A light gray for the layout background
        description: 'Refreshing green, promoting ease and clarity',
        icon: 'nature',
        isAccessibilityFocused: false,
      },
       
      
    // Add other themes similarly...
    {
        name: 'Accessibility',
        textColor: '#000000', // High contrast black text
        textSize: '18px', // Larger text size for better visibility
        bgColor: '#f5ebe0', // High contrast white background
        primaryColor: '#FFD700', // Gold color for important action items, which has good visibility
        secondaryColor: '#EEEEEE', // A very light gray for less important elements
        iconColor: '#e', // High contrast for icons as well
        borderBottom: '1px solid #000000', // High contrast border
        layoutColor: 'e9edc9', // A light gray for the layout background
        description: 'High contrast and larger text for better readability',
        icon: 'visibility',
        isAccessibilityFocused: true,
      },

      {
        name: 'Dark',
        textColor: '#FFFFFF', // White text for readability
        textSize: '16px', // Standard text size for readability
        bgColor: '#333533', // Black background for a dark theme
        primaryColor: '#00FF00', // Green for primary actions
        secondaryColor: '#808080', // Gray for secondary elements
        iconColor: '#FFFFFF', // White icons for better contrast
        tableHeaderBgColor: '#656d4a',
        borderBottom: '1px solid #FFFFFF', // White border for a dark theme
        description: 'A dark theme for a more formal setting',
        icon: 'brightness_2',
        isAccessibilityFocused: false,
      }
      
  ];
  

