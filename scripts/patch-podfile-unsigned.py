"""Disable code signing for CocoaPods targets (unsigned IPA / SideStore)."""

from __future__ import annotations

from pathlib import Path
import re
import sys

SNIPPET = """
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['EXPANDED_CODE_SIGN_IDENTITY'] = ""
        config.build_settings['CODE_SIGNING_REQUIRED'] = "NO"
        config.build_settings['CODE_SIGNING_ALLOWED'] = "NO"
      end
    end
    installer.target_installation_results.pod_target_installation_results
      .each do |pod_name, target_installation_result|
      target_installation_result.resource_bundle_targets.each do |resource_bundle_target|
        resource_bundle_target.build_configurations.each do |config|
          config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
        end
      end
    end
"""

MARKER = "EXPANDED_CODE_SIGN_IDENTITY"


def main() -> int:
    podfile_path = Path("ios/Podfile")
    if not podfile_path.is_file():
        print("ios/Podfile not found. Run expo prebuild first.", file=sys.stderr)
        return 1

    text = podfile_path.read_text(encoding="utf-8")
    if MARKER in text:
        return 0

    match = re.search(
        r"(react_native_post_install\([\s\S]*?\)\n)",
        text,
        count=1,
    )
    if not match:
        print("Could not find react_native_post_install in Podfile.", file=sys.stderr)
        return 1

    updated = text[: match.end()] + SNIPPET + text[match.end() :]
    podfile_path.write_text(updated, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
