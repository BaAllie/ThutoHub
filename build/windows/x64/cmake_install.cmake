<<<<<<< HEAD
# Install script for directory: C:/Users/USER/Documents/CHIHUMURA/thutohub/windows
=======
# Install script for directory: C:/Users/USER/Documents/HACKATHON/thutohub/windows
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "$<TARGET_FILE_DIR:thutohub>")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
<<<<<<< HEAD
  include("C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/flutter/cmake_install.cmake")
=======
  include("C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/flutter/cmake_install.cmake")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
<<<<<<< HEAD
  include("C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/cmake_install.cmake")
=======
  include("C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/cmake_install.cmake")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
<<<<<<< HEAD
  include("C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/app_links/cmake_install.cmake")
=======
  include("C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/app_links/cmake_install.cmake")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
<<<<<<< HEAD
  include("C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/flutter_tts/cmake_install.cmake")
=======
  include("C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/flutter_tts/cmake_install.cmake")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
<<<<<<< HEAD
  include("C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/url_launcher_windows/cmake_install.cmake")
=======
  include("C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/url_launcher_windows/cmake_install.cmake")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
<<<<<<< HEAD
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/thutohub.exe")
=======
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/thutohub.exe")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug" TYPE EXECUTABLE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/thutohub.exe")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/thutohub.exe")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug" TYPE EXECUTABLE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/thutohub.exe")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/thutohub.exe")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile" TYPE EXECUTABLE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/thutohub.exe")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/thutohub.exe")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile" TYPE EXECUTABLE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/thutohub.exe")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/thutohub.exe")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release" TYPE EXECUTABLE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/thutohub.exe")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release" TYPE EXECUTABLE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/thutohub.exe")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
<<<<<<< HEAD
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/data/icudtl.dat")
=======
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/data/icudtl.dat")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/data" TYPE FILE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/windows/flutter/ephemeral/icudtl.dat")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/data/icudtl.dat")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/data" TYPE FILE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/windows/flutter/ephemeral/icudtl.dat")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/data/icudtl.dat")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/data" TYPE FILE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/windows/flutter/ephemeral/icudtl.dat")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/data/icudtl.dat")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/data" TYPE FILE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/windows/flutter/ephemeral/icudtl.dat")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/data/icudtl.dat")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/data" TYPE FILE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/windows/flutter/ephemeral/icudtl.dat")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/data" TYPE FILE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/windows/flutter/ephemeral/icudtl.dat")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
<<<<<<< HEAD
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/flutter_windows.dll")
=======
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/flutter_windows.dll")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug" TYPE FILE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/windows/flutter/ephemeral/flutter_windows.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/flutter_windows.dll")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug" TYPE FILE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/windows/flutter/ephemeral/flutter_windows.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/flutter_windows.dll")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile" TYPE FILE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/windows/flutter/ephemeral/flutter_windows.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/flutter_windows.dll")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile" TYPE FILE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/windows/flutter/ephemeral/flutter_windows.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/flutter_windows.dll")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release" TYPE FILE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/windows/flutter/ephemeral/flutter_windows.dll")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release" TYPE FILE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/windows/flutter/ephemeral/flutter_windows.dll")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
<<<<<<< HEAD
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/app_links_plugin.dll;C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/flutter_tts_plugin.dll;C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/url_launcher_windows_plugin.dll")
=======
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/app_links_plugin.dll;C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/flutter_tts_plugin.dll;C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/url_launcher_windows_plugin.dll")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug" TYPE FILE FILES
      "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/app_links/Debug/app_links_plugin.dll"
      "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/flutter_tts/Debug/flutter_tts_plugin.dll"
      "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/url_launcher_windows/Debug/url_launcher_windows_plugin.dll"
      )
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/app_links_plugin.dll;C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/flutter_tts_plugin.dll;C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/url_launcher_windows_plugin.dll")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug" TYPE FILE FILES
      "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/app_links/Debug/app_links_plugin.dll"
      "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/flutter_tts/Debug/flutter_tts_plugin.dll"
      "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/url_launcher_windows/Debug/url_launcher_windows_plugin.dll"
      )
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/app_links_plugin.dll;C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/flutter_tts_plugin.dll;C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/url_launcher_windows_plugin.dll")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile" TYPE FILE FILES
      "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/app_links/Profile/app_links_plugin.dll"
      "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/flutter_tts/Profile/flutter_tts_plugin.dll"
      "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/url_launcher_windows/Profile/url_launcher_windows_plugin.dll"
      )
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/app_links_plugin.dll;C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/flutter_tts_plugin.dll;C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/url_launcher_windows_plugin.dll")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile" TYPE FILE FILES
      "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/app_links/Profile/app_links_plugin.dll"
      "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/flutter_tts/Profile/flutter_tts_plugin.dll"
      "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/url_launcher_windows/Profile/url_launcher_windows_plugin.dll"
      )
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/app_links_plugin.dll;C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/flutter_tts_plugin.dll;C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/url_launcher_windows_plugin.dll")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release" TYPE FILE FILES
      "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/app_links/Release/app_links_plugin.dll"
      "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/flutter_tts/Release/flutter_tts_plugin.dll"
      "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/url_launcher_windows/Release/url_launcher_windows_plugin.dll"
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release" TYPE FILE FILES
      "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/app_links/Release/app_links_plugin.dll"
      "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/flutter_tts/Release/flutter_tts_plugin.dll"
      "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/url_launcher_windows/Release/url_launcher_windows_plugin.dll"
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
      )
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
<<<<<<< HEAD
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/")
=======
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug" TYPE DIRECTORY FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/native_assets/windows/")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug" TYPE DIRECTORY FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build/native_assets/windows/")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile" TYPE DIRECTORY FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/native_assets/windows/")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile" TYPE DIRECTORY FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build/native_assets/windows/")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release" TYPE DIRECTORY FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/native_assets/windows/")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release" TYPE DIRECTORY FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build/native_assets/windows/")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    
<<<<<<< HEAD
  file(REMOVE_RECURSE "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/data/flutter_assets")
  
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    
  file(REMOVE_RECURSE "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/data/flutter_assets")
  
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    
  file(REMOVE_RECURSE "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/data/flutter_assets")
=======
  file(REMOVE_RECURSE "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/data/flutter_assets")
  
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    
  file(REMOVE_RECURSE "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/data/flutter_assets")
  
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    
  file(REMOVE_RECURSE "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/data/flutter_assets")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
  
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
<<<<<<< HEAD
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/data/flutter_assets")
=======
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/data/flutter_assets")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Debug/data" TYPE DIRECTORY FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build//flutter_assets")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/data/flutter_assets")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Debug/data" TYPE DIRECTORY FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build//flutter_assets")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/data/flutter_assets")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/data" TYPE DIRECTORY FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build//flutter_assets")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/data/flutter_assets")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/data" TYPE DIRECTORY FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build//flutter_assets")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/data/flutter_assets")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/data" TYPE DIRECTORY FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build//flutter_assets")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/data" TYPE DIRECTORY FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build//flutter_assets")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
<<<<<<< HEAD
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/data/app.so")
=======
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/data/app.so")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Profile/data" TYPE FILE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/app.so")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/data/app.so")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Profile/data" TYPE FILE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/app.so")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/data/app.so")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
<<<<<<< HEAD
    file(INSTALL DESTINATION "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/runner/Release/data" TYPE FILE FILES "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/app.so")
=======
    file(INSTALL DESTINATION "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/runner/Release/data" TYPE FILE FILES "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/app.so")
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
  endif()
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
if(CMAKE_INSTALL_LOCAL_ONLY)
<<<<<<< HEAD
  file(WRITE "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/install_local_manifest.txt"
=======
  file(WRITE "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/install_local_manifest.txt"
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
if(CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_COMPONENT MATCHES "^[a-zA-Z0-9_.+-]+$")
    set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
  else()
    string(MD5 CMAKE_INST_COMP_HASH "${CMAKE_INSTALL_COMPONENT}")
    set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INST_COMP_HASH}.txt")
    unset(CMAKE_INST_COMP_HASH)
  endif()
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
<<<<<<< HEAD
  file(WRITE "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/${CMAKE_INSTALL_MANIFEST}"
=======
  file(WRITE "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/${CMAKE_INSTALL_MANIFEST}"
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
