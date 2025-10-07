#!/bin/bash

# Script to upload environment variables from .env to Fly.io
# Usage: 
#   ./upload_env_to_fly.sh              # Upload all variables
#   ./upload_env_to_fly.sh -k KEY_NAME  # Upload only specific key

set -e  # Exit on any error

ENV_FILE=".env"
FLY_APP="tamayo"  # Change this to your Fly app name if different

# Parse command line arguments
SPECIFIC_KEY=""
while [[ $# -gt 0 ]]; do
    case $1 in
        -k|--key)
            SPECIFIC_KEY="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -k, --key KEY_NAME    Upload only the specified key"
            echo "  -h, --help           Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                   # Upload all environment variables"
            echo "  $0 -k PROJECT_NAME   # Upload only PROJECT_NAME"
            echo "  $0 --key DATABASE_URL # Upload only DATABASE_URL"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

if [[ -n "$SPECIFIC_KEY" ]]; then
    echo -e "${BLUE}🚀 Uploading specific key '${SPECIFIC_KEY}' from ${ENV_FILE} to Fly.io app: ${FLY_APP}${NC}"
else
    echo -e "${BLUE}🚀 Uploading all environment variables from ${ENV_FILE} to Fly.io app: ${FLY_APP}${NC}"
fi

# Check if .env file exists
if [[ ! -f "$ENV_FILE" ]]; then
    echo -e "${RED}❌ Error: $ENV_FILE file not found!${NC}"
    exit 1
fi

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo -e "${RED}❌ Error: Fly CLI not found. Please install it first.${NC}"
    echo "Install with: curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if logged into Fly.io
if ! fly auth whoami &> /dev/null; then
    echo -e "${RED}❌ Error: Not logged into Fly.io. Please login first.${NC}"
    echo "Login with: fly auth login"
    exit 1
fi

# Variables to skip (these should not be uploaded to production)
SKIP_VARS=("DOMAIN" "FRONTEND_HOST")

# Function to check if variable should be skipped
should_skip() {
    local var_name="$1"
    for skip in "${SKIP_VARS[@]}"; do
        if [[ "$var_name" == "$skip" ]]; then
            return 0
        fi
    done
    return 1
}

echo -e "${YELLOW}📋 Parsing ${ENV_FILE}...${NC}"

# Count total variables and successful uploads
total_vars=0
uploaded_vars=0
skipped_vars=0

# Read .env file line by line
found_key=false
while IFS= read -r line || [[ -n "$line" ]]; do
    # Skip empty lines and comments
    if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
        continue
    fi
    
    # Extract variable name and value
    if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
        var_name="${BASH_REMATCH[1]}"
        var_value="${BASH_REMATCH[2]}"
        
        # Remove leading/trailing whitespace
        var_name=$(echo "$var_name" | xargs)
        var_value=$(echo "$var_value" | xargs)
        
        # Remove quotes if present
        var_value=$(echo "$var_value" | sed 's/^["'\'']\|["'\'']$//g')
        
        # If specific key is requested, only process that key
        if [[ -n "$SPECIFIC_KEY" && "$var_name" != "$SPECIFIC_KEY" ]]; then
            continue
        fi
        
        # Mark that we found the requested key
        if [[ -n "$SPECIFIC_KEY" && "$var_name" == "$SPECIFIC_KEY" ]]; then
            found_key=true
        fi
        
        total_vars=$((total_vars + 1))
        
        # Check if this variable should be skipped (only when uploading all)
        if [[ -z "$SPECIFIC_KEY" ]] && should_skip "$var_name"; then
            echo -e "${YELLOW}⏭️  Skipping $var_name (local development only)${NC}"
            skipped_vars=$((skipped_vars + 1))
            continue
        fi
        
        # Upload to Fly.io
        echo -e "${BLUE}📤 Uploading $var_name...${NC}"
        if fly secrets set "$var_name=$var_value" --app "$FLY_APP"; then
            uploaded_vars=$((uploaded_vars + 1))
            echo -e "${GREEN}✅ Successfully uploaded $var_name${NC}"
        else
            echo -e "${RED}❌ Failed to upload $var_name${NC}"
        fi
    fi
done < "$ENV_FILE"

# Check if specific key was found
if [[ -n "$SPECIFIC_KEY" && "$found_key" == false ]]; then
    echo -e "${RED}❌ Error: Key '$SPECIFIC_KEY' not found in $ENV_FILE${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Upload complete!${NC}"
echo -e "${BLUE}📊 Summary:${NC}"

if [[ -n "$SPECIFIC_KEY" ]]; then
    echo -e "  • Requested key: $SPECIFIC_KEY"
    echo -e "  • Successfully uploaded: $uploaded_vars"
    echo -e "  • Failed: $((total_vars - uploaded_vars))"
else
    echo -e "  • Total variables in .env: $total_vars"
    echo -e "  • Successfully uploaded: $uploaded_vars"
    echo -e "  • Skipped (local only): $skipped_vars"
    echo -e "  • Failed: $((total_vars - uploaded_vars - skipped_vars))"
fi

echo -e "\n${YELLOW}💡 Next steps:${NC}"
echo -e "  • Deploy your app: ${BLUE}fly deploy${NC}"
echo -e "  • View secrets: ${BLUE}fly secrets list --app $FLY_APP${NC}"
echo -e "  • Remove a secret: ${BLUE}fly secrets unset VARIABLE_NAME --app $FLY_APP${NC}"
