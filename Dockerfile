# Dockerfile
FROM ubuntu:22.04

# Install curl, libc, and other dependencies
RUN apt update && apt install -y curl libtinfo6 libatomic1 libstdc++6 && apt clean

# Copy Llamafile binary into container
COPY DeepSeek-R1-Distill-Qwen-14B-Q4_K_M.llamafile.exe /llamafile

# Make sure it is executable
RUN chmod +x /llamafile

# Expose the OpenAI-compatible API port
EXPOSE 8080

# Default command
CMD ["/llamafile", "--server"]
