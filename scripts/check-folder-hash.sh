hash=($(find $0 -type f -exec cat {} \; | sha256sum))

echo $hash
