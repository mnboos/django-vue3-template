FROM alpine:3.17 as builder
ARG VERSION

WORKDIR /tmp

RUN apk add -U --no-cache --upgrade busybox autoconf autoconf-doc automake udns udns-dev curl gcc libc-dev libevent libevent-dev libtool make openssl-dev pkgconfig postgresql-client
RUN curl -o  pgbouncer-$VERSION.tar.gz -L https://pgbouncer.github.io/downloads/files/$VERSION/pgbouncer-$VERSION.tar.gz &&\
    tar xvfz pgbouncer-$VERSION.tar.gz

WORKDIR /tmp/pgbouncer-$VERSION
RUN  ./configure --prefix=/usr --with-udns && make

FROM alpine:3.17
ARG VERSION

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

RUN apk add -U --no-cache --upgrade busybox libevent udns

RUN mkdir -p /etc/pgbouncer /var/log/pgbouncer /var/run/pgbouncer
COPY --from=builder /tmp/pgbouncer-$VERSION/pgbouncer /usr/bin
COPY --from=builder /tmp/pgbouncer-$VERSION/etc/pgbouncer.ini /etc/pgbouncer/pgbouncer.ini.example
COPY --from=builder /tmp/pgbouncer-$VERSION/etc/userlist.txt /etc/pgbouncer/userlist.txt.example
RUN touch /etc/pgbouncer/userlist.txt

RUN adduser -D postgres &&\
    chown -R postgres /var/run/pgbouncer /etc/pgbouncer

COPY entrypoint.sh /entrypoint.sh
USER postgres
EXPOSE 5432
ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/pgbouncer", "/etc/pgbouncer/pgbouncer.ini"]