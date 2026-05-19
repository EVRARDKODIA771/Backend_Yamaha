import sys
import os
from mido import MidiFile

print("====================================")
print("PYTHON STYLE PROCESS STARTED")

# ======================================================
# ARGUMENTS
# ======================================================

sty_path = sys.argv[1]
original_name = sys.argv[2]

print("STY PATH =", sty_path)
print("ORIGINAL NAME =", original_name)

base_name = os.path.splitext(
    original_name
)[0]

print("BASE NAME =", base_name)

# ======================================================
# STY -> MID
# ======================================================

print("====================================")
print("STEP 1 : STY -> MID")

# IMPORTANT :
# Pour l'instant on considère que le STY
# contient déjà une structure MIDI lisible.
# Plus tard :
# - SFF parsing
# - CASM extraction
# - SFF1/SFF2 support
# - split non-midi sections

full_mid_path = sty_path

print("FULL MID PATH =", full_mid_path)

# ======================================================
# LOAD MIDI
# ======================================================

print("====================================")
print("STEP 2 : LOADING MIDI")

mid = MidiFile(full_mid_path)

print("TRACK COUNT =", len(mid.tracks))

# ======================================================
# DETECT MARKERS
# ======================================================

print("====================================")
print("STEP 3 : DETECTING STYLE SECTIONS")

sections = []

for track_index, track in enumerate(mid.tracks):

    print("------------------------------------")
    print("TRACK =", track_index)

    for msg in track:

        if msg.type == "marker":

            marker_name = msg.text.strip()

            print(
                "MARKER DETECTED =",
                marker_name
            )

            # Ignore Yamaha internal markers

            ignored_markers = [
                "SFF1",
                "SFF2",
                "SInt"
            ]

            if marker_name in ignored_markers:

                print(
                    "IGNORED INTERNAL MARKER"
                )

                continue

            if marker_name not in sections:

                sections.append(marker_name)

# ======================================================
# SUMMARY
# ======================================================

print("====================================")
print("DETECTED SECTIONS")

for section in sections:

    print("SECTION =", section)

# ======================================================
# CREATE MIDI FOLDER
# ======================================================

print("====================================")
print("STEP 4 : CREATING OUTPUT FOLDER")

midis_output_folder = os.path.join(
    "temp",
    "midis",
    base_name
)

os.makedirs(
    midis_output_folder,
    exist_ok=True
)

print(
    "MIDIS OUTPUT FOLDER =",
    midis_output_folder
)

# ======================================================
# SPLIT MIDI BY SECTION
# ======================================================

print("====================================")
print("STEP 5 : SPLITTING MIDI")

for section in sections:

    safe_section_name = (
        section
        .replace(" ", "_")
        .replace("/", "_")
    )

    output_mid_name = (
        f"{base_name}_{safe_section_name}.mid"
    )

    output_mid_path = os.path.join(
        midis_output_folder,
        output_mid_name
    )

    # TODO:
    # vrai split des events MIDI
    # selon les markers

    print(
        "GENERATING SECTION MIDI =",
        output_mid_name
    )

    # fake temp file

    with open(output_mid_path, "w") as f:

        f.write("TEMP MIDI PLACEHOLDER")

# ======================================================
# WAV OUTPUT FOLDER
# ======================================================

print("====================================")
print("STEP 6 : WAV GENERATION")

wav_output_folder = os.path.join(
    "temp",
    "wav",
    base_name
)

os.makedirs(
    wav_output_folder,
    exist_ok=True
)

print(
    "WAV OUTPUT FOLDER =",
    wav_output_folder
)

# ======================================================
# MIDI -> WAV
# ======================================================

for section in sections:

    safe_section_name = (
        section
        .replace(" ", "_")
        .replace("/", "_")
    )

    wav_name = (
        f"{base_name}_{safe_section_name}.wav"
    )

    wav_path = os.path.join(
        wav_output_folder,
        wav_name
    )

    print(
        "GENERATING WAV =",
        wav_name
    )

    # TODO:
    # fluidsynth rendering réel

    with open(wav_path, "w") as f:

        f.write("TEMP WAV PLACEHOLDER")

# ======================================================
# FINAL
# ======================================================

print("====================================")
print("PROCESS FINISHED SUCCESSFULLY")
print("====================================")
