echo "Creating binaries..."
cd test
go run .
mv bin1.bin ../bin.bin
mv bin2.bin ../hello.bin
cd ..