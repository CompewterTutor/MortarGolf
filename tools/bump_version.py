#!/usr/bin/env python3
"""
Version Bump Script for MortarGolf

Bumps the version number across all project files.
Usage: python tools/bump_version.py [major|minor|patch]

Example:
    python tools/bump_version.py patch  # 0.0.3 -> 0.0.4
    python tools/bump_version.py minor  # 0.0.3 -> 0.1.0
    python tools/bump_version.py major  # 0.0.3 -> 1.0.0
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime


def get_project_root():
    """Get the project root directory (MortarGolf folder)"""
    return Path(__file__).parent.parent


def read_current_version():
    """Read current version from package.json"""
    project_root = get_project_root()
    package_json = project_root / "package.json"
    
    with open(package_json, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    version = data.get('version', '0.0.0')
    parts = version.split('.')
    return [int(p) for p in parts]


def bump_version(current_version, bump_type):
    """
    Bump version based on type
    
    Args:
        current_version: List of [major, minor, patch]
        bump_type: 'major', 'minor', or 'patch'
    
    Returns:
        New version as list [major, minor, patch]
    """
    major, minor, patch = current_version
    
    if bump_type == 'major':
        return [major + 1, 0, 0]
    elif bump_type == 'minor':
        return [major, minor + 1, 0]
    elif bump_type == 'patch':
        return [major, minor, patch + 1]
    else:
        raise ValueError(f"Invalid bump type: {bump_type}. Use 'major', 'minor', or 'patch'")


def version_to_string(version):
    """Convert version list to string"""
    return '.'.join(str(v) for v in version)


def update_package_json(new_version_str):
    """Update version in package.json"""
    project_root = get_project_root()
    package_json = project_root / "package.json"
    
    with open(package_json, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace version in package.json
    content = re.sub(
        r'"version":\s*"[^"]*"',
        f'"version": "{new_version_str}"',
        content
    )
    
    with open(package_json, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Updated package.json")


def update_constants_ts(new_version):
    """Update VERSION constant in constants.ts"""
    project_root = get_project_root()
    constants_ts = project_root / "src" / "constants.ts"
    
    with open(constants_ts, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace VERSION array
    version_str = f"[{new_version[0]}, {new_version[1]}, {new_version[2]}]"
    content = re.sub(
        r'export const VERSION = \[[^\]]+\];',
        f'export const VERSION = {version_str};',
        content
    )
    
    with open(constants_ts, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Updated src/constants.ts")


def update_readme(new_version_str):
    """Update version badges and footer in README.md"""
    project_root = get_project_root()
    readme = project_root / "README.md"
    
    with open(readme, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update version badge
    content = re.sub(
        r'badge/version-[^-]+-blue',
        f'badge/version-{new_version_str}-blue',
        content
    )
    
    # Update footer version
    content = re.sub(
        r'\*Version: [^\*]+\*',
        f'*Version: {new_version_str}*',
        content
    )
    
    with open(readme, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Updated README.md")


def update_todo_md(new_version_str):
    """Update version in todo.md"""
    project_root = get_project_root()
    todo_md = project_root / "llm" / "todo.md"
    
    with open(todo_md, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update version in header
    content = re.sub(
        r'\*\*Version\*\*: [^\n]+',
        f'**Version**: {new_version_str}',
        content
    )
    
    # Update last updated date
    today = datetime.now().strftime("%B %d, %Y")
    content = re.sub(
        r'\*\*Last Updated\*\*: [^\n]+',
        f'**Last Updated**: {today}',
        content
    )
    
    with open(todo_md, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Updated llm/todo.md")


def add_changelog_placeholder(new_version_str):
    """Add a new version section to CHANGELOG.md"""
    project_root = get_project_root()
    changelog = project_root / "CHANGELOG.md"
    
    with open(changelog, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the position after the header
    today = datetime.now().strftime("%Y-%m-%d")
    new_section = f"""## [{new_version_str}] - {today}

### Added

### Changed

### Fixed

### Technical

"""
    
    # Insert after the format description and before the first version
    # Find the first occurrence of "## [" which is the start of version history
    match = re.search(r'\n## \[', content)
    if match:
        pos = match.start()
        content = content[:pos] + '\n' + new_section + content[pos+1:]
    else:
        # If no existing version sections, append at end
        content += '\n' + new_section
    
    with open(changelog, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Added placeholder section to CHANGELOG.md")


def main():
    """Main entry point"""
    if len(sys.argv) != 2:
        print("Usage: python tools/bump_version.py [major|minor|patch]")
        print("\nExamples:")
        print("  python tools/bump_version.py patch  # 0.0.3 -> 0.0.4")
        print("  python tools/bump_version.py minor  # 0.0.3 -> 0.1.0")
        print("  python tools/bump_version.py major  # 0.0.3 -> 1.0.0")
        sys.exit(1)
    
    bump_type = sys.argv[1].lower()
    
    if bump_type not in ['major', 'minor', 'patch']:
        print(f"Error: Invalid bump type '{bump_type}'")
        print("Must be one of: major, minor, patch")
        sys.exit(1)
    
    try:
        # Read current version
        current_version = read_current_version()
        current_version_str = version_to_string(current_version)
        
        # Calculate new version
        new_version = bump_version(current_version, bump_type)
        new_version_str = version_to_string(new_version)
        
        print(f"\n📦 Bumping version: {current_version_str} -> {new_version_str} ({bump_type})\n")
        
        # Update all files
        update_package_json(new_version_str)
        update_constants_ts(new_version)
        update_readme(new_version_str)
        update_todo_md(new_version_str)
        add_changelog_placeholder(new_version_str)
        
        print(f"\n✅ Version bumped successfully to {new_version_str}!")
        print(f"\nNext steps:")
        print(f"1. Update CHANGELOG.md with changes for v{new_version_str}")
        print(f"2. Update llm/memory.md with development progress")
        print(f"3. Review and commit changes:")
        print(f"   git add -A")
        print(f"   git commit -m \"chore: bump version to {new_version_str}\"")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
