// ====================================
// CONFIGURATION SECTION - MULTI-YEAR
// ====================================

const ADMIN_ID = "1mDm5vKJZONpxtrNMUdabTz8q3GKuoivGZvSK79-IkdM";

// Sheet names in your admin spreadsheet
const FORM_SHEET = "FORM";  
const PASSKEY_SHEET = "PASSKEY";       

// Sheet names in your current/main spreadsheet
const SUBMISSION_FORM = "SUBMISSION FORM";
const DASHBOARD = "DASHBOARD";
const WEEKLY = "WEEKLY";

const TIMEZONE = "GMT+8";

// ====================================
// NEW: MULTI-DATE SUBMISSION HANDLER
// ====================================
/**
 * Submit multiple non-consecutive dates with different leave types
 * This is the NEW main submission function
 */
function submitMultipleDatesWeb(formData) {
  console.log("Starting submitMultipleDatesWeb with data:", formData);
  
  try {
    if (!formData || !formData.entries || formData.entries.length === 0) {
      return { success: false, message: 'Tiada data tarikh diterima'
      };
    }

    const { name, entries
    } = formData;
    
    if (!name) {
      return { success: false, message: 'Sila pilih nama staf'
      };
    }
    // Validate all dates first
    const today = new Date();
    today.setHours(0,
    0,
    0,
    0);
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 3);
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 4);
    
    const validationErrors = [];
    const processedDates = new Set();
    
    entries.forEach((entry, index) => {
      const dateObj = parseFormDate(entry.date);
      dateObj.setHours(0,
      0,
      0,
      0);
      
      if (dateObj < minDate) {
        validationErrors.push(`Tarikh ${index + 1
        }: Mestilah sekurang-kurangnya 3 hari dari hari ini`);
      }
      
      if (dateObj > maxDate) {
        validationErrors.push(`Tarikh ${index + 1
        }: Tidak boleh melebihi 4 bulan dari hari ini`);
      }
      
      const dateKey = `${entry.date
      }-${entry.type
      }`;
      if (processedDates.has(dateKey)) {
        validationErrors.push(`Tarikh ${index + 1
        }: Tarikh dan jenis yang sama telah dipilih`);
      }
      processedDates.add(dateKey);
    });
    
    if (validationErrors.length > 0) {
      return { 
        success: false, 
        message: validationErrors.join('; ')
      };
    }
    // Check for duplicate submissions (within last 5 seconds)
    if (checkDuplicateSubmission(name, entries)) {
      return { 
        success: false, 
        message: 'Permohonan yang sama telah dihantar baru-baru ini. Sila tunggu sebentar.'
      };
    }
    // Access admin spreadsheet
    let admin;
    try {
      admin = SpreadsheetApp.openById(ADMIN_ID);
      console.log("Successfully opened admin spreadsheet:", admin.getName());
    } catch (adminError) {
      console.error("Admin access error:", adminError);
      return { success: false, message: 'Tidak dapat mengakses pangkalan data. Hubungi pentadbir.'
      };
    }
    
    const formSheet = admin.getSheetByName(FORM_SHEET);
    if (!formSheet) {
      console.error(`Form sheet "${FORM_SHEET}" not found`);
      return { success: false, message: `Tidak dapat mengakses helaian "${FORM_SHEET}". Hubungi pentadbir.`
      };
    }
    // Check if month sheets exist for all dates
    const missingSheets = checkMissingMonthSheets(entries);
    if (missingSheets.length > 0) {
      return {
        success: false,
        message: `Helaian bulan tidak wujud: ${missingSheets.join(', ')
        }. Sila hubungi pentadbir.`
      };
    }
    // Process each date entry
    const results = {
      success: [],
      failed: []
    };
    
    entries.forEach((entry, index) => {
      try {
        const dateObj = parseFormDate(entry.date);
        const dateStr = formatDateForSheet(dateObj);
        
        // Use individual note for this entry
        const finalNote = entry.note || '';
        const displayName = finalNote ? `${name
        }(${finalNote
        })` : name;
        
        // Add to admin form sheet
        formSheet.appendRow([
          new Date(), 
          name, 
          dateStr, 
          entry.type, 
          finalNote, 
          '', '', '', ''
        ]);
        
        // Add to main sheets
        const insertSuccess = webInsertToSheets(displayName, dateStr, entry.type);
        
        if (insertSuccess) {
          results.success.push(`${dateStr
          } - ${entry.type
          }`);
        } else {
          results.failed.push(`${dateStr
          } - ${entry.type
          }`);
        }
      } catch (entryError) {
        console.error(`Error processing entry ${index
        }:`, entryError);
        results.failed.push(`Tarikh ${index + 1
        }: ${entryError.message
        }`);
      }
    });
    
    // Update weekly sheet
    try {
      webUpdateWeeklyFromMonthSheet();
    } catch (weeklyError) {
      console.error("Weekly update error:", weeklyError);
    }
    // Generate result message
    let message = '';
    if (results.success.length > 0) {
      message += `Berjaya: ${results.success.length
      } tarikh dihantar`;
    }
    if (results.failed.length > 0) {
      message += (message ? '. ' : '') + `Gagal: ${results.failed.length
      } tarikh (${results.failed.join(', ')
      })`;
    }
    
    console.log(`Submission completed. Success: ${results.success.length
    }, Failed: ${results.failed.length
    }`);
    
    return { 
      success: results.success.length > 0, 
      message: message || 'Tiada tarikh diproses'
    };
  } catch (error) {
    console.error('Unexpected error in submitMultipleDatesWeb:', error);
    return { 
      success: false, 
      message: `Ralat sistem: ${error.message
      }. Sila hubungi pentadbir.`
    };
  }
}
// ====================================
// IMPROVED HELPER FUNCTIONS
// ====================================
/**
 * Parse date from yyyy-MM-dd format (HTML date input)
 */
function parseFormDate(dateString) {
  try {
    const [year, month, day
    ] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error("Date parsing error:", error);
    throw new Error("Format tarikh tidak sah");
  }
}
/**
 * Format date for spreadsheet (dd/MM/yyyy)
 */
function formatDateForSheet(date) {
  try {
    return Utilities.formatDate(new Date(date), TIMEZONE,
    "dd/MM/yyyy");
  } catch (error) {
    console.error("Date formatting error:", error);
    return null;
  }
}
/**
 * Normalize date (remove time component)
 */
function normalizeDate(date) {
  const d = new Date(date);
  d.setHours(0,
  0,
  0,
  0);
  return d;
}
/**
 * Parse date from dd/MM/yyyy format (from spreadsheet)
 */
function parseSheetDate(dateStr) {
  try {
    const parts = dateStr.split('/');
    if (parts.length !== 3) {
      throw new Error("Invalid date format");
    }
    
    const day = parseInt(parts[
      0
    ],
    10);
    const month = parseInt(parts[
      1
    ],
    10) - 1;
    const year = parseInt(parts[
      2
    ],
    10);
    
    return new Date(year, month, day);
  } catch (error) {
    console.error("Date parsing error:", error);
    return new Date();
  }
}
/**
 * Check for duplicate submissions within last 5 seconds
 */
function checkDuplicateSubmission(name, entries) {
  try {
    const admin = SpreadsheetApp.openById(ADMIN_ID);
    const formSheet = admin.getSheetByName(FORM_SHEET);
    const data = formSheet.getDataRange().getValues();
    
    const fiveSecondsAgo = new Date(Date.now() - 5000);
    const entryKeys = entries.map(e => `${name
    }-${e.date
    }-${e.type
    }`);
    
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i
      ][
        0
      ] < fiveSecondsAgo) break;
      
      const rowKey = `${data[i
        ][
          1
        ]
      }-${formatDateForSheet(data[i
        ][
          2
        ])
      }-${data[i
        ][
          3
        ]
      }`;
      
      if (entryKeys.includes(rowKey)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Duplicate check error:", error);
    return false;
  }
}
/**
 * Check if month sheets exist for all dates
 */
function checkMissingMonthSheets(entries) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const missingSheets = new Set();
  
  entries.forEach(entry => {
    const dateObj = parseFormDate(entry.date);
    const monthSheet = findMonthSheet(dateObj);
    
    if (!monthSheet) {
      const possibleNames = getMonthSheetNames(dateObj);
      missingSheets.add(possibleNames[
        0
      ]);
    }
  });
  
  return Array.from(missingSheets);
}
/**
 * Get possible month sheet names for a date
 */
function getMonthSheetNames(date) {
  try {
    const dateObj = new Date(date);
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC"
    ];
    
    return [
      `${monthNames[month
        ]
      } ${year
      }`,
      `${monthNames[month
        ]
      }_${year
      }`,
      `${monthNames[month
        ]
      }-${year
      }`,
      `${year
      }_${monthNames[month
        ]
      }`,
      `${year
      }-${monthNames[month
        ]
      }`,
      monthNames[month
      ]
    ];
  } catch (error) {
    console.error("Month sheet name error:", error);
    return [
      "JAN"
    ];
  }
}
/**
 * Find the correct month sheet for a date
 */
function findMonthSheet(date) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const possibleNames = getMonthSheetNames(date);
    
    for (const name of possibleNames) {
      const sheet = ss.getSheetByName(name);
      if (sheet) {
        return sheet;
      }
    }
    
    console.log(`No month sheet found for date: ${date
    }`);
    return null;
  } catch (error) {
    console.error("Error finding month sheet:", error);
    return null;
  }
}
/**
 * Insert entry to both dashboard and month sheets
 * Returns true if successful, false otherwise
 */
function webInsertToSheets(displayName, dateStr, type) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const typeColumnMap = {
      "DAY OFF/CUTI REHAT": 3,
      "KURSUS/MEETING": 4,
      "AM OFF": 5,
      "PM OFF": 6,
      "POST-MN": 7,
      "METHADONE": 8
    };

    const col = typeColumnMap[type
    ];
    if (!col) {
      console.error("Invalid leave type:", type);
      return false;
    }

    const dateObj = parseSheetDate(dateStr);
    const targetSheets = [
      ss.getSheetByName(DASHBOARD),
      findMonthSheet(dateObj)
    ];
    
    let anySuccess = false;
    
    targetSheets.forEach(sheet => {
      if (!sheet) return;
      
      try {
        const data = sheet.getDataRange().getValues();
        
        for (let i = 3; i < data.length; i++) {
          if (data[i
          ][
            0
          ] && data[i
          ][
            0
          ] instanceof Date) {
            const rowDateStr = formatDateForSheet(data[i
            ][
              0
            ]);
            
            if (rowDateStr === dateStr) {
              const cell = sheet.getRange(i + 1, col);
              const current = cell.getValue().toString().trim();
              const names = current ? current.split('\n') : [];

              if (!names.includes(displayName)) {
                names.push(displayName);
                const newText = names.join('\n');
                cell.setValue(newText);
                anySuccess = true;
              }
              break;
            }
          }
        }
      } catch (sheetError) {
        console.error(`Error updating sheet ${sheet.getName()
        }:`, sheetError);
      }
    });
    
    return anySuccess;
  } catch (error) {
    console.error("Error in webInsertToSheets:", error);
    return false;
  }
}
// ====================================
// AUTO WEEK UPDATE FUNCTIONS
// ====================================
/**
 * Get current week's start (Monday) and end (Friday) dates - WEEKDAYS ONLY
 * @param {number} weeksAhead - Number of weeks to look ahead (default: 0 for current week)
 */
function getCurrentWeekDates(weeksAhead = 0) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate Monday (start of week)
  const monday = new Date(today);
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + daysToMonday);
  monday.setHours(0,
  0,
  0,
  0);
  
  // Add weeks ahead if specified
  if (weeksAhead > 0) {
    monday.setDate(monday.getDate() + (weeksAhead * 7));
  }
  // Calculate Friday (end of work week) - NOT Sunday
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4); // Monday + 4 days = Friday
  friday.setHours(23,
  59,
  59,
  999);
  
  return {
    start: monday,
    end: friday
  };
}
/**
 * Update weekly sheet from month sheets (IMPROVED VERSION)
 * Auto-sets current week if dates are invalid or empty
 * WEEKDAYS ONLY (Monday-Friday)
 */
function webUpdateWeeklyFromMonthSheet() {
  try {
    console.log("Starting webUpdateWeeklyFromMonthSheet...");
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const weekly = ss.getSheetByName(WEEKLY);
    if (!weekly) {
      return { success: false, message: "Helaian mingguan tidak dijumpai"
      };
    }

    let startDate = weekly.getRange("D1").getValue();
    let endDate = weekly.getRange("F1").getValue();
    
    // Auto-set to current week if dates are empty or invalid
    if (!startDate || !endDate || !(startDate instanceof Date) || !(endDate instanceof Date)) {
      const weekDates = getCurrentWeekDates();
      startDate = weekDates.start;
      endDate = weekDates.end;
      weekly.getRange("D1").setValue(startDate);
      weekly.getRange("F1").setValue(endDate);
      console.log(`Auto-set week dates (Mon-Fri): ${startDate
      } to ${endDate
      }`);
    }
    // Validate dates after auto-set
    if (!startDate || !endDate) {
      return { success: false, message: "Tarikh mula atau tamat tidak dijumpai"
      };
    }

    if (!(startDate instanceof Date)) startDate = new Date(startDate);
    if (!(endDate instanceof Date)) endDate = new Date(endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { success: false, message: "Tarikh tidak sah"
      };
    }

    console.log(`Processing date range (WEEKDAYS): ${startDate.toDateString()
    } to ${endDate.toDateString()
    }`);

    weekly.getRange("A4:H").clearContent();

    const datesByMonth = {};
    let currentDate = new Date(startDate);
    
    // Only process weekdays (Monday to Friday)
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      
      // Skip Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const monthSheet = findMonthSheet(currentDate);
        if (monthSheet) {
          const sheetName = monthSheet.getName();
          if (!datesByMonth[sheetName
          ]) {
            datesByMonth[sheetName
            ] = {
              sheet: monthSheet,
              dates: []
            };
          }
          datesByMonth[sheetName
          ].dates.push(new Date(currentDate));
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    let copiedRows = 0;
    let rowPointer = 4;
    
    Object.keys(datesByMonth).forEach(sheetName => {
      const { sheet, dates
      } = datesByMonth[sheetName
      ];
      
      try {
        const data = sheet.getDataRange().getValues();
        
        dates.forEach(targetDate => {
          for (let i = 3; i < data.length; i++) {
            const rowDate = data[i
            ][
              0
            ];
            if (!rowDate || !(rowDate instanceof Date)) continue;

            const normalizedRowDate = normalizeDate(rowDate);
            const normalizedTargetDate = normalizeDate(targetDate);

            if (normalizedRowDate.getTime() === normalizedTargetDate.getTime()) {
              const rowData = [];
              for (let col = 0; col < 8; col++) {
                rowData.push(data[i
                ][col
                ] || '');
              }

              weekly.getRange(rowPointer,
              1,
              1,
              8).setValues([rowData
              ]);
              copiedRows++;
              rowPointer++;
              break;
            }
          }
        });
      } catch (sheetError) {
        console.error(`Error processing sheet ${sheetName
        }:`, sheetError);
      }
    });

    console.log(`Weekly update completed. Copied ${copiedRows
    } weekday rows.`);
    return { 
      success: true, 
      message: `Helaian mingguan dikemas kini (Isnin-Jumaat). Disalin ${copiedRows
      } baris.`
    };
  } catch (error) {
    console.error('Unexpected error in webUpdateWeeklyFromMonthSheet:', error);
    return { 
      success: false, 
      message: `Ralat sistem: ${error.message
      }`
    };
  }
}
/**
 * Auto-update weekly sheet to NEXT week (1 week ahead)
 * WEEKDAYS ONLY: Monday to Friday
 * Can be called manually or via trigger
 */
function autoUpdateWeeklySheet() {
  try {
    console.log("=== AUTO UPDATE WEEKLY SHEET (NEXT WEEK - MON TO FRI) ===");
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const weekly = ss.getSheetByName(WEEKLY);
    
    if (!weekly) {
      return "Weekly sheet not found";
    }
    // Set NEXT week dates (1 week ahead) - Monday to Friday only
    const weekDates = getCurrentWeekDates(1); // 1 week ahead
    weekly.getRange("D1").setValue(weekDates.start);
    weekly.getRange("F1").setValue(weekDates.end);
    
    console.log(`Week dates set (NEXT WEEK Mon-Fri): ${formatDateForSheet(weekDates.start)
    } to ${formatDateForSheet(weekDates.end)
    }`);
    
    // Update the weekly data
    const result = webUpdateWeeklyFromMonthSheet();
    
    return `Weekly sheet auto-updated to NEXT week Mon-Fri (${formatDateForSheet(weekDates.start)
    } - ${formatDateForSheet(weekDates.end)
    })`;
  } catch (error) {
    console.error("Auto-update error:", error);
    return `Auto-update failed: ${error.message
    }`;
  }
}
/**
 * Create time-based trigger to update weekly sheet
 * Run this once to set up automatic updates
 * Updates to NEXT week every Monday at 12:01 AM
 * WEEKDAYS ONLY: Monday to Friday
 */
function setupWeeklyAutoUpdate() {
  try {
    // Delete existing triggers for this function
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'autoUpdateWeeklySheet') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Create new trigger: runs every Monday at 12:01 AM
    // Shows NEXT week (1 week ahead) - Monday to Friday only
    ScriptApp.newTrigger('autoUpdateWeeklySheet')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(0)
      .create();
    
    return "Weekly auto-update trigger created successfully! Will run every Monday at 12:01 AM and show NEXT week (Mon-Fri only).";
  } catch (error) {
    console.error("Trigger setup error:", error);
    return `Trigger setup failed: ${error.message
    }`;
  }
}
/**
 * Remove weekly auto-update trigger
 */
function removeWeeklyAutoUpdate() {
  try {
    const triggers = ScriptApp.getProjectTriggers();
    let removed = 0;
    
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'autoUpdateWeeklySheet') {
        ScriptApp.deleteTrigger(trigger);
        removed++;
      }
    });
    
    return `Removed ${removed
    } auto-update trigger(s)`;
  } catch (error) {
    console.error("Trigger removal error:", error);
    return `Trigger removal failed: ${error.message
    }`;
  }
}
/**
 * Manually update weekly sheet to show CURRENT week
 * WEEKDAYS ONLY: Monday to Friday
 */
function updateToCurrentWeek() {
  try {
    console.log("=== UPDATE TO CURRENT WEEK (MON-FRI) ===");
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const weekly = ss.getSheetByName(WEEKLY);
    
    if (!weekly) {
      return "Weekly sheet not found";
    }
    // Set current week dates (0 weeks ahead = this week) - Monday to Friday only
    const weekDates = getCurrentWeekDates(0);
    weekly.getRange("D1").setValue(weekDates.start);
    weekly.getRange("F1").setValue(weekDates.end);
    
    console.log(`Week dates set (CURRENT WEEK Mon-Fri): ${formatDateForSheet(weekDates.start)
    } to ${formatDateForSheet(weekDates.end)
    }`);
    
    // Update the weekly data
    const result = webUpdateWeeklyFromMonthSheet();
    
    return `Weekly sheet updated to CURRENT week Mon-Fri (${formatDateForSheet(weekDates.start)
    } - ${formatDateForSheet(weekDates.end)
    })`;
  } catch (error) {
    console.error("Update error:", error);
    return `Update failed: ${error.message
    }`;
  }
}
/**
 * Manually update weekly sheet to show specific weeks ahead
 * WEEKDAYS ONLY: Monday to Friday
 * @param {number} weeksAhead - Number of weeks ahead (0 = current, 1 = next, 2 = 2 weeks ahead, etc.)
 */
function updateToWeeksAhead(weeksAhead) {
  try {
    if (typeof weeksAhead !== 'number' || weeksAhead < 0) {
      return "Please provide a valid number of weeks (0 or greater)";
    }
    
    console.log(`=== UPDATE TO ${weeksAhead
    } WEEK(S) AHEAD (MON-FRI) ===`);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const weekly = ss.getSheetByName(WEEKLY);
    
    if (!weekly) {
      return "Weekly sheet not found";
    }
    
    const weekDates = getCurrentWeekDates(weeksAhead);
    weekly.getRange("D1").setValue(weekDates.start);
    weekly.getRange("F1").setValue(weekDates.end);
    
    console.log(`Week dates set (Mon-Fri): ${formatDateForSheet(weekDates.start)
    } to ${formatDateForSheet(weekDates.end)
    }`);
    
    // Update the weekly data
    const result = webUpdateWeeklyFromMonthSheet();
    
    const weekLabel = weeksAhead === 0 ? "current week": 
                      weeksAhead === 1 ? "next week": 
                      `${weeksAhead
    } weeks ahead`;
    
    return `Weekly sheet updated to ${weekLabel
    } Mon-Fri (${formatDateForSheet(weekDates.start)
    } - ${formatDateForSheet(weekDates.end)
    })`;
  } catch (error) {
    console.error("Update error:", error);
    return `Update failed: ${error.message
    }`;
  }
}
// ====================================
// LEGACY TYPE MATCHING & CANCELLATION
// ====================================
/**
 * Normalize leave type names to handle legacy data
 */
function normalizeLeaveType(type) {
  const normalized = type.toString().trim().toUpperCase();
  
  // Map old types to new types
  const typeMapping = {
    'DAY OFF': 'DAY OFF/CUTI REHAT',
    'DAYOFF': 'DAY OFF/CUTI REHAT',
    'CUTI REHAT': 'DAY OFF/CUTI REHAT',
    'KURSUS': 'KURSUS/MEETING',
    'MEETING': 'KURSUS/MEETING',
    'AM': 'AM OFF',
    'PM': 'PM OFF',
    'POST-MN': 'POST-MN',
    'POSTMN': 'POST-MN',
    'POST MN': 'POST-MN',
    'METHADONE': 'METHADONE'
  };
  
  // Check if it's already a full new format
  if (normalized === 'DAY OFF/CUTI REHAT' || 
      normalized === 'KURSUS/MEETING' || 
      normalized === 'AM OFF' || 
      normalized === 'PM OFF' || 
      normalized === 'POST-MN' || 
      normalized === 'METHADONE') {
    return type.trim();
  }
  // Map old format to new format
  return typeMapping[normalized
  ] || type.trim();
}
/**
 * Check if two leave types match (handles legacy names)
 */
function leaveTypesMatch(type1, type2) {
  const normalized1 = normalizeLeaveType(type1).toUpperCase();
  const normalized2 = normalizeLeaveType(type2).toUpperCase();
  return normalized1 === normalized2;
}
/**
 * Cancel multiple dates (consecutive or non-consecutive)
 * NEW function for batch cancellations
 */
function cancelMultipleDatesWeb(formData) {
  console.log("Starting cancelMultipleDatesWeb with data:", formData);
  
  try {
    if (!formData || !formData.entries || formData.entries.length === 0) {
      return { success: false, message: 'Tiada data tarikh diterima'
      };
    }

    const { name, passkey, entries, note
    } = formData;
    
    if (!name || !passkey) {
      return { success: false, message: 'Sila isi nama dan passkey'
      };
    }
    
    let adminSS;
    try {
      adminSS = SpreadsheetApp.openById(ADMIN_ID);
    } catch (adminError) {
      console.error("Admin access error:", adminError);
      return { success: false, message: 'Tidak dapat mengakses pangkalan data. Hubungi pentadbir.'
      };
    }
    
    const formSheet = adminSS.getSheetByName(FORM_SHEET);
    const passkeySheet = adminSS.getSheetByName(PASSKEY_SHEET);
    
    if (!formSheet || !passkeySheet) {
      return { success: false, message: 'Tidak dapat mengakses helaian yang diperlukan. Hubungi pentadbir.'
      };
    }
    // Verify passkey
    try {
      const passkeys = passkeySheet.getRange("B2:C").getValues();
      let correctPasskey = null;
      
      for (let i = 0; i < passkeys.length; i++) {
        if (passkeys[i
        ][
          0
        ] && passkeys[i
        ][
          1
        ]) {
          const sheetName = passkeys[i
          ][
            0
          ].toString().trim().toLowerCase();
          const sheetPass = passkeys[i
          ][
            1
          ].toString().trim();
          if (sheetName === name.toLowerCase()) {
            correctPasskey = sheetPass;
            break;
          }
        }
      }
      
      if (!correctPasskey || correctPasskey !== passkey) {
        return { success: false, message: 'Passkey tidak betul atau pengguna tidak dijumpai'
        };
      }
    } catch (passkeyError) {
      console.error("Passkey verification error:", passkeyError);
      return { success: false, message: 'Ralat mengesahkan passkey. Hubungi pentadbir.'
      };
    }
    // Process cancellations
    const results = {
      success: [],
      failed: [],
      notFound: []
    };
    
    const data = formSheet.getDataRange().getValues();
    
    entries.forEach((entry, entryIndex) => {
      try {
        const targetDate = parseFormDate(entry.date);
        const dateFormatted = formatDateForSheet(targetDate);
        
        console.log(`Looking for: ${name
        }, ${dateFormatted
        }, ${entry.type
        }`);
        
        let found = false;
        
        for (let i = data.length - 1; i >= 1; i--) {
          const row = data[i
          ];
          
          if (!row[
            1
          ] || !row[
            2
          ] || !row[
            3
          ]) continue;
          
          if (row[
            6
          ] === "cancelled" || row[
            6
          ] === "CANCELLED") continue;
          
          const rowName = row[
            1
          ].toString().trim().toLowerCase();
          const inputName = name.toLowerCase();
          const rowType = row[
            3
          ].toString().trim();
          
          let rowDateFormatted;
          if (row[
            2
          ] instanceof Date) {
            rowDateFormatted = formatDateForSheet(row[
              2
            ]);
          } else {
            try {
              rowDateFormatted = row[
                2
              ].toString();
            } catch (parseError) {
              continue;
            }
          }
          
          if (rowName === inputName && 
              rowDateFormatted === dateFormatted && 
              leaveTypesMatch(rowType, entry.type)) {
            
            console.log(`Match found at row ${i + 1
            }`);
            
            const savedNote = row[
              4
            ] ? row[
              4
            ].toString().trim() : '';
            const savedDisplayName = savedNote ? `${row[
                1
              ]
            }(${savedNote
            })` : row[
              1
            ].toString();
            
            formSheet.getRange(i + 1,
            6).setValue(new Date());
            formSheet.getRange(i + 1,
            7).setValue("cancelled");
            formSheet.getRange(i + 1,
            8).setValue(note || '');
            formSheet.getRange(i + 1,
            1,
            1,
            9).setBackground("#f4cccc");
            
            try {
              clearNameFromSheets(dateFormatted, savedDisplayName, rowType);
            } catch (updateError) {
              console.error("Error updating sheets:", updateError);
            }
            
            results.success.push(`${dateFormatted
            } - ${entry.type
            }`);
            found = true;
            break;
          }
        }
        
        if (!found) {
          results.notFound.push(`${dateFormatted
          } - ${entry.type
          }`);
        }
      } catch (entryError) {
        console.error(`Error processing entry ${entryIndex
        }:`, entryError);
        results.failed.push(`Tarikh ${entryIndex + 1
        }: ${entryError.message
        }`);
      }
    });
    
    // Update weekly sheet once at the end
    try {
      webUpdateWeeklyFromMonthSheet();
    } catch (weeklyError) {
      console.error("Weekly update error:", weeklyError);
    }
    // Generate result message
    let message = '';
    if (results.success.length > 0) {
      message += `Berjaya dibatalkan: ${results.success.length
      } tarikh`;
    }
    if (results.notFound.length > 0) {
      message += (message ? '. ' : '') + `Tidak dijumpai: ${results.notFound.length
      } tarikh (${results.notFound.join(', ')
      })`;
    }
    if (results.failed.length > 0) {
      message += (message ? '. ' : '') + `Gagal: ${results.failed.length
      } tarikh (${results.failed.join(', ')
      })`;
    }
    
    console.log(`Cancellation completed. Success: ${results.success.length
    }, Not Found: ${results.notFound.length
    }, Failed: ${results.failed.length
    }`);
    
    return { 
      success: results.success.length > 0, 
      message: message || 'Tiada tarikh dibatalkan'
    };
  } catch (error) {
    console.error('Unexpected error in cancelMultipleDatesWeb:', error);
    return { 
      success: false, 
      message: `Ralat sistem: ${error.message
      }. Sila hubungi pentadbir.`
    };
  }
}
/**
 * Clear name from both dashboard and month sheets
 */
function clearNameFromSheets(dateStr, displayName, type) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const typeColumnMap = {
      "DAY OFF/CUTI REHAT": 3,
      "KURSUS/MEETING": 4,
      "AM OFF": 5,
      "PM OFF": 6,
      "POST-MN": 7,
      "METHADONE": 8
    };
    
    const col = typeColumnMap[type
    ];
    if (!col) return;
    
    const dateObj = parseSheetDate(dateStr);
    const targetSheets = [
      ss.getSheetByName(DASHBOARD),
      findMonthSheet(dateObj)
    ];
    
    targetSheets.forEach(sheet => {
      if (!sheet) return;
      
      try {
        const data = sheet.getDataRange().getValues();
        for (let i = 3; i < data.length; i++) {
          if (data[i
          ][
            0
          ] && formatDateForSheet(data[i
          ][
            0
          ]) === dateStr) {
            const cell = sheet.getRange(i + 1, col);
            const current = cell.getValue().toString();
            const lines = current.split('\n');
            const updatedLines = lines.filter(line => line.trim() !== displayName.trim());
            cell.setValue(updatedLines.join('\n'));
            break;
          }
        }
      } catch (error) {
        console.error(`Error clearing from ${sheet.getName()
        }:`, error);
      }
    });
  } catch (error) {
    console.error("Error in clearNameFromSheets:", error);
  }
}
// ====================================
// WEB APP ENTRY POINT
// ====================================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('Planner Cuti FPL HSM');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
// ====================================
// MIGRATION & UTILITY FUNCTIONS
// ====================================
/**
 * Update legacy leave type names to new format
 * Run this once to migrate old data
 */
function migrateLegacyLeaveTypes() {
  try {
    console.log("=== MIGRATING LEGACY LEAVE TYPES ===");
    
    const adminSS = SpreadsheetApp.openById(ADMIN_ID);
    const formSheet = adminSS.getSheetByName(FORM_SHEET);
    
    if (!formSheet) {
      return "Form sheet not found";
    }
    
    const data = formSheet.getDataRange().getValues();
    let updatedCount = 0;
    
    for (let i = 1; i < data.length; i++) {
      const currentType = data[i
      ][
        3
      ];
      if (!currentType) continue;
      
      const normalizedType = normalizeLeaveType(currentType);
      
      if (normalizedType !== currentType.toString().trim()) {
        formSheet.getRange(i + 1,
        4).setValue(normalizedType);
        updatedCount++;
        console.log(`Row ${i + 1
        }: Updated "${currentType}" to "${normalizedType}"`);
      }
    }
    
    console.log(`Migration completed. Updated ${updatedCount
    } records.`);
    return `Migration completed. Updated ${updatedCount
    } records from legacy format.`;
  } catch (error) {
    console.error("Migration error:", error);
    return `Migration failed: ${error.message
    }`;
  }
}
/**
 * Create multi-year dashboard with dates for current and next year
 */
function createMultiYearDashboard() {
  try {
    console.log("=== CREATING MULTI-YEAR DASHBOARD ===");
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let dashboard = ss.getSheetByName(DASHBOARD);
    
    if (!dashboard) {
      dashboard = ss.insertSheet(DASHBOARD);
    }
    
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear,
    0,
    1);
    const endDate = new Date(currentYear + 1,
    11,
    31);
    
    const dates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const dashboardData = dates.map(date => [
      date,
      formatDateForSheet(date),
      '', '', '', '', '', ''
    ]);
    
    const headerRows = 3;
    if (dashboardData.length > 0) {
      dashboard.getRange(headerRows + 1,
      1, dashboardData.length,
      8).setValues(dashboardData);
      dashboard.getRange(headerRows + 1,
      1, dashboardData.length,
      1).setNumberFormat("dd/mm/yyyy");
    }
    
    return `Multi-year dashboard created with ${dates.length
    } dates`;
  } catch (error) {
    console.error("Error creating multi-year dashboard:", error);
    return `Error: ${error.message
    }`;
  }
}
/**
 * Create next year's month sheets
 */
function createNextYearMonthSheets() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const nextYear = new Date().getFullYear() + 1;
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC"
    ];
    
    const createdSheets = [];
    
    monthNames.forEach(month => {
      const sheetName = `${month
      } ${nextYear
      }`;
      let sheet = ss.getSheetByName(sheetName);
      
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        createdSheets.push(sheetName);
        
        const currentYearSheet = ss.getSheetByName(month);
        if (currentYearSheet) {
          const headerData = currentYearSheet.getRange("A1:H3").getValues();
          const headerFormat = currentYearSheet.getRange("A1:H3");
          
          sheet.getRange("A1:H3").setValues(headerData);
          headerFormat.copyTo(sheet.getRange("A1:H3"));
        }
      }
    });
    
    if (createdSheets.length > 0) {
      return `Created ${createdSheets.length
      } sheets for ${nextYear
      }`;
    } else {
      return `All month sheets for ${nextYear
      } already exist`;
    }
  } catch (error) {
    console.error("Error creating next year sheets:", error);
    return `Error: ${error.message
    }`;
  }
}
/**
 * Setup passkey sheet
 */
function setupPasskeySheet() {
  try {
    const adminSS = SpreadsheetApp.openById(ADMIN_ID);
    let passkeySheet = adminSS.getSheetByName(PASSKEY_SHEET);
    
    if (!passkeySheet) {
      passkeySheet = adminSS.insertSheet(PASSKEY_SHEET);
    }
    
    passkeySheet.getRange("A1").setValue("User Management");
    passkeySheet.getRange("B1").setValue("Name");
    passkeySheet.getRange("C1").setValue("Passkey");
    
    passkeySheet.getRange("A1:C1").setFontWeight("bold");
    passkeySheet.getRange("A1:C1").setBackground("#4285f4");
    passkeySheet.getRange("A1:C1").setFontColor("white");
    
    return "Passkey sheet setup successful";
  } catch (error) {
    console.error("Passkey setup error:", error);
    return `Setup failed: ${error.message
    }`;
  }
}
/**
 * Setup form sheet
 */
function setupFormSheet() {
  try {
    const adminSS = SpreadsheetApp.openById(ADMIN_ID);
    let formSheet = adminSS.getSheetByName(FORM_SHEET);
    
    if (!formSheet) {
      formSheet = adminSS.insertSheet(FORM_SHEET);
    }
    
    const headers = [
      "Timestamp",
      "Name",
      "Date",
      "Type",
      "Note",
      "Processed Time",
      "Status",
      "Cancel Note",
      "Admin Notes"
    ];
    
    if (formSheet.getLastRow() === 0) {
      formSheet.getRange(1,
      1,
      1, headers.length).setValues([headers
      ]);
      formSheet.getRange(1,
      1,
      1, headers.length).setFontWeight("bold");
      formSheet.getRange(1,
      1,
      1, headers.length).setBackground("#34a853");
      formSheet.getRange(1,
      1,
      1, headers.length).setFontColor("white");
    }
    
    return "Form sheet setup successful";
  } catch (error) {
    console.error("Form sheet setup error:", error);
    return `Setup failed: ${error.message
    }`;
  }
}
// ====================================
// DEBUG FUNCTIONS
// ====================================

function testMultipleDateSubmission() {
  const testData = {
    name: "Test User",
    entries: [
      { date: "2025-01-15", type: "DAY OFF/CUTI REHAT", note: "Test 1"
      },
      { date: "2025-01-20", type: "AM OFF", note: "Test 2"
      },
      { date: "2025-02-05", type: "KURSUS/MEETING", note: ""
      }
    ]
  };
  
  console.log("Testing multiple date submission:", testData);
  
  try {
    const result = submitMultipleDatesWeb(testData);
    console.log("Test result:", result);
    return result;
  } catch (error) {
    console.error("Test failed:", error);
    return { success: false, message: error.message
    };
  }
}

function testMultipleDateCancellation() {
  const testData = {
    name: "Test User",
    passkey: "test123",
    entries: [
      { date: "2025-01-15", type: "DAY OFF/CUTI REHAT"
      },
      { date: "2025-01-20", type: "AM OFF"
      }
    ],
    note: "Testing cancellation"
  };
  
  console.log("Testing multiple date cancellation:", testData);
  
  try {
    const result = cancelMultipleDatesWeb(testData);
    console.log("Test result:", result);
    return result;
  } catch (error) {
    console.error("Test failed:", error);
    return { success: false, message: error.message
    };
  }
}

function testConnection() {
  try {
    console.log("=== CONNECTION TEST ===");
    
    const adminSS = SpreadsheetApp.openById(ADMIN_ID);
    console.log("✅ Admin spreadsheet accessible:", adminSS.getName());
    
    const currentSS = SpreadsheetApp.getActiveSpreadsheet();
    console.log("✅ Current spreadsheet:", currentSS.getName());
    
    return "Connection test completed - check logs";
  } catch (error) {
    console.error("❌ Connection test failed:", error);
    return `Connection test failed: ${error.message
    }`;
  }
}