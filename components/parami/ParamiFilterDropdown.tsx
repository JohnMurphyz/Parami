import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllParamis } from '../../services/firebaseContentService';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface ParamiFilterDropdownProps {
  selectedParamiIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
}

export default function ParamiFilterDropdown({
  selectedParamiIds,
  onSelectionChange
}: ParamiFilterDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const allParamis = getAllParamis();

  const toggleParami = (id: number) => {
    if (selectedParamiIds.includes(id)) {
      onSelectionChange(selectedParamiIds.filter(pid => pid !== id));
    } else {
      onSelectionChange([...selectedParamiIds, id]);
    }
  };

  const selectAll = () => {
    onSelectionChange(allParamis.map(p => p.id));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const selectedCount = selectedParamiIds.length;
  const displayText = selectedCount === 0
    ? 'Filter'
    : selectedCount === allParamis.length
    ? 'All'
    : `${selectedCount}`;

  return (
    <View>
      {/* Trigger Button */}
      <TouchableOpacity
        style={styles.triggerButton}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
        accessibilityLabel="Filter by Parami"
        accessibilityRole="button"
      >
        <Ionicons name="filter" size={18} color={Colors.deepStone} />
        <Text style={styles.triggerText}>{displayText}</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={Colors.mediumStone}
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isExpanded}
        transparent
        animationType="fade"
        onRequestClose={() => setIsExpanded(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsExpanded(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownTitle}>Filter by Parami</Text>

              {/* Select All / Clear All */}
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={selectAll} style={styles.actionButton}>
                  <Text style={styles.actionText}>Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={clearAll} style={styles.actionButton}>
                  <Text style={styles.actionText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              {/* Parami Checkboxes */}
              <ScrollView style={styles.optionsList}>
                {allParamis.map((parami) => {
                  const isSelected = selectedParamiIds.includes(parami.id);
                  return (
                    <TouchableOpacity
                      key={parami.id}
                      style={styles.optionRow}
                      onPress={() => toggleParami(parami.id)}
                      activeOpacity={0.7}
                      accessibilityLabel={`${parami.name} — ${parami.englishName}`}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected }}
                    >
                      <View style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected
                      ]}>
                        {isSelected && (
                          <Ionicons name="checkmark" size={18} color={Colors.saffronGold} />
                        )}
                      </View>
                      <Text style={styles.optionText}>
                        {parami.name} — {parami.englishName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Apply Button */}
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setIsExpanded(false)}
                activeOpacity={0.7}
                accessibilityLabel="Apply filter"
                accessibilityRole="button"
              >
                <Text style={styles.applyButtonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.pureWhite,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.softAsh,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  triggerText: {
    ...Typography.body,
    color: Colors.deepStone,
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(43, 37, 32, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dropdownContainer: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 20,
    padding: 24,
    width: 320,
    maxHeight: 600,
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  dropdownTitle: {
    ...Typography.h2,
    color: Colors.deepCharcoal,
    marginBottom: 16,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softAsh,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    ...Typography.body,
    color: Colors.saffronGold,
    fontWeight: '600',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.softAsh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: Colors.saffronGold,
    backgroundColor: Colors.saffronGold08,
  },
  optionText: {
    ...Typography.body,
    color: Colors.deepStone,
    flex: 1,
  },
  applyButton: {
    backgroundColor: Colors.saffronGold,
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: Colors.deepCharcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  applyButtonText: {
    ...Typography.body,
    color: Colors.pureWhite,
    fontWeight: '600',
  },
});
