#! /bin/bash

PORJECT_NAME='MyProject'
AUTHOR_NAME='Kennylee'
AUTHOR_EMAIL='kennylee26@gmail.com'
DESCRIPTION=''
PACKAGE_FILE=package.json
BUILD_FILE=gulpfile.js

# mac 环境下，需要 -i 后加 ""
sed -i "" "s/\"name\"\: \"BaseJsProject\"/\"name\"\: \"$PORJECT_NAME\"/" $PACKAGE_FILE
sed -i "" "s/\"name\"\: \"KennyLee\"/\"name\"\: \"$AUTHOR_NAME\"/" $PACKAGE_FILE
sed -i "" "s/\"email\"\: \"kennylee26\@gmail\.com\"/\"email\"\: \"$AUTHOR_EMAIL\"/" $PACKAGE_FILE
sed -i "" "s/\"description\"\: \".*\"/\"description\"\: \"$DESCRIPTION\"/" $PACKAGE_FILE
sed -i "" "s/projectName = \'.*\'/projectName = \'$PORJECT_NAME\'/" $BUILD_FILE