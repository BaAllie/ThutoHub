<<<<<<< HEAD
# Install script for directory: C:/Users/USER/Documents/CHIHUMURA/thutohub/windows/flutter/ephemeral/.plugin_symlinks/url_launcher_windows/windows
=======
# Install script for directory: C:/Users/USER/Documents/HACKATHON/thutohub/windows/flutter/ephemeral/.plugin_symlinks/url_launcher_windows/windows
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

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
if(CMAKE_INSTALL_LOCAL_ONLY)
<<<<<<< HEAD
  file(WRITE "C:/Users/USER/Documents/CHIHUMURA/thutohub/build/windows/x64/plugins/url_launcher_windows/install_local_manifest.txt"
=======
  file(WRITE "C:/Users/USER/Documents/HACKATHON/thutohub/build/windows/x64/plugins/url_launcher_windows/install_local_manifest.txt"
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
