import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type MainTab =
  | 'discover'
  | 'matches'
  | 'applications'
  | 'profile';

type BottomNavProps = {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
};

export default function BottomNav({
  activeTab,
  onTabChange,
}: BottomNavProps) {
  const tabs: {
    key: MainTab;
    icon: string;
    label: string;
  }[] = [
    {
      key: 'discover',
      icon: '◉',
      label: 'Discover',
    },
    {
      key: 'matches',
      icon: '♡',
      label: 'Matches',
    },
    {
      key: 'applications',
      icon: '▣',
      label: 'Applications',
    },
    {
      key: 'profile',
      icon: '♙',
      label: 'Profile',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active =
          activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            style={styles.item}
            onPress={() =>
              onTabChange(tab.key)
            }
          >
            <Text
              style={[
                styles.icon,
                active &&
                  styles.activeText,
              ]}
            >
              {tab.icon}
            </Text>

            <Text
              style={[
                styles.label,
                active &&
                  styles.activeText,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 78,
    flexDirection: 'row',
    backgroundColor: '#080D1A',
    borderTopWidth: 1,
    borderTopColor: '#20263A',
    paddingBottom: 8,
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  icon: {
    fontSize: 23,
    color: '#8B91A5',
  },

  label: {
    fontSize: 12,
    color: '#8B91A5',
    fontWeight: '600',
  },

  activeText: {
    color: '#8B5CF6',
  },
});